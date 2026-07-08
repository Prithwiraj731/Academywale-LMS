const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is missing in environment configuration');
}

// Public client for standard frontend & client-facing API requests
const supabase = createClient(supabaseUrl || 'http://placeholder-url.supabase.co', supabaseAnonKey || 'placeholder-key');

// Admin client using service role key (bypasses RLS, used for admin dashboard operations and data migrations)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl || 'http://placeholder-url.supabase.co', supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

module.exports = {
  supabase,
  supabaseAdmin
};
