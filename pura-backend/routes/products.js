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

// GET product variants
router.get('/:id/variants', async (req, res) => {
  try {
    const { data: variants, error } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', req.params.id)
      .order('variant_name');

    if (error) throw error;
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add variant (Admin only)
router.post('/:id/variants', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { variant_name, color_hex, size_ml, stock } = req.body;
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .insert({ product_id: req.params.id, variant_name, color_hex, size_ml, stock: stock || 0 })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update variant (Admin only)
router.put('/:id/variants/:variantId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { variant_name, color_hex, size_ml, stock } = req.body;
    const { data, error } = await supabaseAdmin
      .from('product_variants')
      .update({ variant_name, color_hex, size_ml, stock })
      .eq('id', req.params.variantId)
      .eq('product_id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE variant (Admin only)
router.delete('/:id/variants/:variantId', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('product_variants')
      .delete()
      .eq('id', req.params.variantId)
      .eq('product_id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Variant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
