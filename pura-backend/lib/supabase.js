const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// The admin client uses the Service Role Key (or Anon Key as fallback) for bypassing RLS when necessary
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

// Factory function to create a Supabase client acting on behalf of a specific user token
const createClientWithToken = (token) => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

module.exports = { supabaseAdmin, createClientWithToken };
