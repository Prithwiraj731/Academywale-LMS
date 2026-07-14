const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { supabaseAdmin } = require('./src/config/supabase.config');

async function run() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      console.log('User record keys:', data.length > 0 ? Object.keys(data[0]) : 'No users found');
    }
  } catch (err) {
    console.error(err);
  }
}

run();
