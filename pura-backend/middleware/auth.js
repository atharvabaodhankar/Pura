const { supabaseAdmin } = require('../lib/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token', details: error });
    }

    // Attach user and raw token to request so subsequent routes can use it for RLS checks via createClientWithToken
    req.user = user;
    req.token = token;
    
    // Also fetch profile role from profiles table to check if admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .maybeSingle();
      
    if (profileError) {
      console.warn("Error fetching user profile role:", profileError);
    }
      
    req.user.role = profile?.role || 'customer';
    req.user.is_admin = req.user.role === 'admin';

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = { requireAuth, requireAdmin };
