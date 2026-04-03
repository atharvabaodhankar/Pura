const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET user cart
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data: cartItems, error } = await supabaseAdmin
      .from('cart')
      .select(`
        id, quantity, product_id, variant_id,
        products (id, name, price, images, compare_price),
        product_variants (id, variant_name, color_hex)
      `)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add to cart
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    
    // Check if item already exists in cart
    let query = supabaseAdmin
      .from('cart')
      .select()
      .eq('user_id', req.user.id)
      .eq('product_id', productId);
    
    if (variantId) {
      query = query.eq('variant_id', variantId);
    } else {
      query = query.is('variant_id', null);
    }

    const { data: existing, error: fetchError } = await query.maybeSingle();
      
    if (fetchError) throw fetchError;

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    } else {
      const { data, error } = await supabaseAdmin
        .from('cart')
        .insert({
          user_id: req.user.id,
          product_id: productId,
          variant_id: variantId,
          quantity
        })
        .select()
        .single();
      if (error) throw error;
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update quantity
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

    const { data, error } = await supabaseAdmin
      .from('cart')
      .update({ quantity })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id) // security check
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove from cart
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('cart')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE clear cart
router.delete('/', requireAuth, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('cart')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
