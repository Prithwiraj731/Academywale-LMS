const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { supabaseAdmin } = require('../config/supabase.config');

async function runBackfill() {
  console.log('🚀 Starting course data backfill migration...');

  try {
    // Fetch all courses
    const { data: courses, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('*');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📋 Found ${courses.length} courses to process.`);

    let updatedCount = 0;

    for (const c of courses) {
      // If custom_details is already populated and has items, skip it (unless we want to overwrite)
      if (c.custom_details && Array.isArray(c.custom_details) && c.custom_details.length > 0) {
        console.log(`⏭️ Course "${c.title}" already has custom details. Skipping.`);
        continue;
      }

      const customDetails = [];
      let order = 1;

      if (c.subject) {
        customDetails.push({
          label: 'Subject',
          value: c.subject,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.no_of_lecture) {
        customDetails.push({
          label: 'Lectures',
          value: c.no_of_lecture,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.timing) {
        customDetails.push({
          label: 'Duration',
          value: c.timing,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.books) {
        customDetails.push({
          label: 'Study Materials',
          value: c.books,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.video_language) {
        customDetails.push({
          label: 'Language',
          value: c.video_language,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.video_run_on) {
        customDetails.push({
          label: 'Video Run On',
          value: c.video_run_on,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.doubt_solving) {
        customDetails.push({
          label: 'Doubt Solving',
          value: c.doubt_solving,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.support_mail) {
        customDetails.push({
          label: 'Support Mail',
          value: c.support_mail,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.support_call) {
        customDetails.push({
          label: 'Support Call',
          value: c.support_call,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.validity_start_from) {
        customDetails.push({
          label: 'Validity',
          value: c.validity_start_from,
          fieldType: 'text',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.faculty_slug && c.faculty_slug !== 'n-a' && c.faculty_slug !== '') {
        customDetails.push({
          label: 'Faculty',
          value: c.faculty_slug,
          fieldType: 'faculty',
          displayOrder: order++,
          visible: true
        });
      }

      if (c.institute_name && c.institute_name !== 'N/A' && c.institute_name !== '') {
        customDetails.push({
          label: 'Institute',
          value: c.institute_name,
          fieldType: 'institute',
          displayOrder: order++,
          visible: true
        });
      }

      // Check if we need to update pricing options to include custom labels
      const updatedPricing = (c.mode_attempt_pricing || []).map(option => {
        return {
          mode: option.mode || '',
          modeLabel: option.modeLabel || 'Mode',
          attempt: option.attempt || '',
          attemptLabel: option.attemptLabel || 'Exam Term / Attempt',
          validity: option.validity || '',
          validityLabel: option.validityLabel || 'Validity',
          costPrice: option.costPrice || option.cost_price || 0,
          sellingPrice: option.sellingPrice || option.selling_price || 0,
          description: option.description || ''
        };
      });

      console.log(`✍️ Backfilling course "${c.title}" with ${customDetails.length} details.`);

      const { error: updateError } = await supabaseAdmin
        .from('courses')
        .update({
          custom_details: customDetails,
          mode_attempt_pricing: updatedPricing
        })
        .eq('id', c.id);

      if (updateError) {
        console.error(`❌ Failed to update course "${c.title}":`, updateError.message);
      } else {
        updatedCount++;
      }
    }

    console.log(`✅ Backfill complete. Successfully updated ${updatedCount} courses.`);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

runBackfill();
