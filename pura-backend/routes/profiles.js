const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET user profile
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // Only allow users to fetch their own profile unless they are admins
    if (req.user.id !== req.params.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update profile
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
