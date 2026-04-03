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
      // Payment matches, update Supabase order to Confirmed
      const { error } = await supabaseAdmin
        .from('orders')
        .update({ status: 'confirmed', payment_id: razorpay_payment_id })
        .eq('id', supabaseOrderId);

      if (error) throw error;
      
      // We should ideally also clear the user's Supabase cart here
      await supabaseAdmin.from('cart').delete().eq('user_id', req.user.id);

      return res.json({ message: "Payment verified successfully", success: true });
    } else {
      // Signature mismatch
      return res.status(400).json({ message: "Invalid signature sent!", success: false });
    }
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
