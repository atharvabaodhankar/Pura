const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// The admin client uses the Service Role Key for bypassing RLS when necessary.
// It is CRITICAL that the backend uses this key for profiles, orders, and cart syncing.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is missing in .env. Backend operations may fail due to RLS violations.');
}

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
