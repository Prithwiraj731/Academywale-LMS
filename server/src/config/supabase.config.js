const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let isServiceKeyAvailable = false;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY is missing in environment configuration');
}

if (!supabaseServiceKey) {
  console.error('❌ CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in environment! Admin operations will fail with RLS policy violations.');
} else if (supabaseServiceKey === supabaseAnonKey) {
  console.error('❌ CRITICAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY is identical to SUPABASE_ANON_KEY! Admin client has no elevated permissions and will fail with RLS policy violations.');
} else {
  isServiceKeyAvailable = true;
}

// Public client for standard frontend & client-facing API requests
const supabase = createClient(supabaseUrl || 'http://placeholder-url.supabase.co', supabaseAnonKey || 'placeholder-key');

// Admin client using service role key (bypasses RLS, used for admin dashboard operations and data migrations)
const supabaseAdmin = isServiceKeyAvailable 
  ? createClient(supabaseUrl || 'http://placeholder-url.supabase.co', supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

module.exports = {
  supabase,
  supabaseAdmin,
  isServiceKeyAvailable
};

