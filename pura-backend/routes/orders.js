const express = require('express');
const router = express.Router();
const { supabaseAdmin, createClientWithToken } = require('../lib/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all orders (Admin Only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;

    if (!ordersData || ordersData.length === 0) {
      return res.json([]);
    }

    const userIds = [...new Set(ordersData.map(o => o.user_id).filter(Boolean))];
    
    let profilesMap = {};
    if (userIds.length > 0) {
      const { data: profilesData } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);
        
      if (profilesData) {
        profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
    }

    const mergedOrders = ordersData.map(order => ({
      ...order,
      profiles: profilesMap[order.user_id] || { full_name: 'Guest', email: '' }
    }));

    res.json(mergedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET my orders (Authenticated User)
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    // Use user-specific client to respect RLS
    const supabase = createClientWithToken(req.token);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order status (Admin Only)
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
