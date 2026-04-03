const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all active products
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new product (Admin Only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const newProduct = req.body;
    // ensure slug is auto-generated if missing
    if (!newProduct.slug) {
      newProduct.slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
