const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { supabase, supabaseAdmin } = require('./src/config/supabase.config');

async function run() {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) + '...' : 'undefined');
  console.log('SUPABASE_ANON_KEY starts with:', process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 15) + '...' : 'undefined');
  
  try {
    // 1. Fetch faculties to get a valid faculty ID
    const { data: faculties, error: facErr } = await supabaseAdmin.from('faculties').select('*').limit(1);
    if (facErr) {
      console.error('Error fetching faculties:', facErr);
      return;
    }
    console.log('Fetched faculties count:', faculties.length);
    if (faculties.length === 0) {
      console.log('No faculties found. Please run migrations or create a faculty first.');
      return;
    }
    const faculty = faculties[0];
    
    // 2. Attempt insert with supabaseAdmin
    console.log('Attempting insert with supabaseAdmin...');
    const testCourse = {
      title: 'Test RLS Course',
      subject: 'Test RLS Subject',
      category: 'CA',
      subcategory: 'Foundation',
      paper_id: '1',
      course_type: 'CA Foundation',
      faculty_id: faculty.id,
      faculty_name: faculty.first_name + ' ' + (faculty.last_name || ''),
      faculty_slug: faculty.slug
    };
    
    const { data: adminData, error: adminErr } = await supabaseAdmin
      .from('courses')
      .insert([testCourse])
      .select();
      
    if (adminErr) {
      console.error('❌ Insert failed with supabaseAdmin:', adminErr);
    } else {
      console.log('✅ Insert succeeded with supabaseAdmin:', adminData);
      // Clean it up
      await supabaseAdmin.from('courses').delete().eq('id', adminData[0].id);
    }

    // 3. Attempt insert with public supabase client
    console.log('Attempting insert with public supabase client...');
    const { data: pubData, error: pubErr } = await supabase
      .from('courses')
      .insert([testCourse])
      .select();
      
    if (pubErr) {
      console.error('❌ Insert failed with public client (expected if RLS is enabled and no token is present):', pubErr.message);
    } else {
      console.log('✅ Insert succeeded with public client:', pubData);
      await supabaseAdmin.from('courses').delete().eq('id', pubData[0].id);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
