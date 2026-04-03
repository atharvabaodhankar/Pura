const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabaseAdmin } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/checkout/create-order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { items, formData } = req.body;
    
    // Safety check
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    // Calculate total securely from Database
    let total_amount = 0;
    const orderItemsToInsert = [];

    for (const item of items) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('price')
        .eq('id', item.product_id)
        .single();
        
      if (error || !product) {
        return res.status(400).json({ error: `Product not found: ${item.product_id}` });
      }

      total_amount += product.price * item.quantity;
      
      orderItemsToInsert.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null, // if variants are implemented
        quantity: item.quantity,
        unit_price: product.price
      });
    }

    // 1. Create a Pending Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: req.user.id,
        total_amount: total_amount,
        status: 'pending',
        shipping_address: {
          full_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
          location: formData.location || null
        },
        payment_method: 'razorpay'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map(i => ({ ...i, order_id: order.id }));
    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemsWithOrderId);
    
    if (itemsError) throw itemsError;

    // 2. Create Razorpay Order
    const options = {
      amount: Math.round(total_amount * 100), // Amount in paise
      currency: "INR",
      receipt: order.id,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      supabaseOrderId: order.id,
      razorpayOrder: razorpayOrder
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Helper to finalize order: confirm status, decrement stock, and clear cart.
 * Can be called by /verify or /webhook.
 */
async function handleOrderSuccess(supabaseOrderId, razorpay_payment_id, userId) {
  // 1. Get ordered items for decrementing stock
  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('product_id, variant_id, quantity')
    .eq('order_id', supabaseOrderId);

  if (itemsError) throw itemsError;

  // 2. Decrement stock for each item using the RPC
  for (const item of items) {
    await supabaseAdmin.rpc('decrement_stock', {
      prod_id: item.product_id,
      var_id: item.variant_id,
      qty: item.quantity
    });
  }

  // 3. Update Supabase order to Confirmed
  const { error: orderUpdateError } = await supabaseAdmin
    .from('orders')
    .update({ 
      status: 'confirmed', 
      payment_id: razorpay_payment_id 
    })
    .eq('id', supabaseOrderId);

  if (orderUpdateError) throw orderUpdateError;
  
  // 4. Clear the user's cart
  if (userId) {
    await supabaseAdmin.from('cart').delete().eq('user_id', userId);
  }
}

// POST /api/checkout/verify
router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      supabaseOrderId 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment signature matches, finalize the order
      await handleOrderSuccess(supabaseOrderId, razorpay_payment_id, req.user.id);
      
      return res.json({ message: "Payment verified and order finalized!", success: true });
    } else {
      // Signature mismatch
      return res.status(400).json({ message: "Invalid signature sent!", success: false });
    }
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/checkout/webhook
// This handles asynchronous confirmation if /verify isn't called or fails
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shorthandSignature = req.headers['x-razorpay-signature'];
    
    // Verify Webhook Signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (shorthandSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // We mainly care about payment captured or order paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payment.entity;
      const orderId = payment.notes.supabaseOrderId || payment.description; // Usually we put orderId in notes
      
      // If we used a custom receipt/notes
      const supabaseOrderId = payment.notes.supabaseOrderId || payload.order.entity.receipt;

      if (supabaseOrderId) {
        // Find user_id from order to clear cart
        const { data: order } = await supabaseAdmin
          .from('orders')
          .select('user_id, status')
          .eq('id', supabaseOrderId)
          .single();

        // Only process if not already confirmed
        if (order && order.status === 'pending') {
          await handleOrderSuccess(supabaseOrderId, payment.id, order.user_id);
          console.log(`Webhook: Finalized order ${supabaseOrderId} via ${event}`);
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
