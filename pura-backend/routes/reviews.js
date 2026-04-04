const express = require('express');
const router = express.Router();
const { supabaseAdmin, createClientWithToken } = require('../lib/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET approved reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        id, rating, comment, created_at, user_id,
        profiles (full_name, avatar_url)
      `)
      .eq('product_id', req.params.productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET my review for a product (so user knows if they already reviewed)
router.get('/product/:productId/mine', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', req.params.productId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit a review (authenticated, must have purchased)
router.post('/product/:productId', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this product
    const { data: existing } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('product_id', req.params.productId)
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product
    const { data: purchased } = await supabaseAdmin
      .from('order_items')
      .select('id, orders!inner(user_id, status)')
      .eq('product_id', req.params.productId)
      .eq('orders.user_id', req.user.id)
      .in('orders.status', ['confirmed', 'shipped', 'delivered'])
      .limit(1)
      .maybeSingle();

    if (!purchased) {
      return res.status(403).json({ error: 'You can only review products you have purchased' });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: req.params.productId,
        user_id: req.user.id,
        rating,
        comment: comment?.trim() || null,
        is_approved: false // pending admin approval
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT approve/reject review (Admin only)
router.put('/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { is_approved } = req.body;
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ is_approved })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all reviews (Admin only) — for moderation
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(`
        id, rating, comment, is_approved, created_at,
        profiles (full_name),
        products (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
