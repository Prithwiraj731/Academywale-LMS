const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { supabaseAdmin } = require('./src/config/supabase.config');

async function run() {
  try {
    console.log('Querying pg_policies...');
    const { data, error } = await supabaseAdmin.rpc('get_policies'); // If custom RPC exists
    
    // Fallback: run a direct SQL query via a generic check if possible,
    // or run a query using raw SQL if we can, but Supabase JS doesn't have raw SQL query support directly unless using a RPC or postgres library.
    // Wait, let's see if we can query pg_policies using standard select if we have permission, or if we can run it via server query.
    // Actually, we can use the postgres connection if there's one, or we can use the supabaseAdmin to check if we can select from pg_policies.
    // Let's try to query pg_policies.
    const { data: policies, error: polError } = await supabaseAdmin
      .from('pg_policies') // pg_policies is a system view, usually not exposed via PostgREST unless configured.
      .select('*');
      
    if (polError) {
      console.log('Could not query pg_policies view directly (expected):', polError.message);
    } else {
      console.log('Policies:', policies);
    }
    
    // Let's query courses, users, faculties table to check their RLS status using a test insert/update.
    // Wait, let's check what tables are in the schema.
    // Let's check RLS status by checking if we can perform operations.
  } catch (err) {
    console.error(err);
  }
}

run();
