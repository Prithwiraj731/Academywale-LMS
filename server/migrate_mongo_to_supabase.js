/**
 * MIGRATION SCRIPT: MongoDB to Supabase
 * This script connects to the existing MongoDB database and migrates all data
 * to Supabase (PostgreSQL and Supabase Storage).
 * 
 * Execution requirements:
 * 1. Define SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in server/.env
 * 2. Define DB_URL (MongoDB connection URI) in server/.env
 * 3. Run: node migrate_mongo_to_supabase.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// Import Mongoose Models
const User = require('./src/model/User.model');
const Faculty = require('./src/model/Faculty.model');
const Institute = require('./src/model/Institute.model');
const Course = require('./src/model/Course.model');
const Coupon = require('./src/model/Coupon.model');
const Testimonial = require('./src/model/Testimonial.model');
const Purchase = require('./src/model/Purchase.model');

// Validate Env variables
const mongoURI = process.env.DB_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service key needed to bypass RLS

if (!mongoURI || !supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables in server/.env. Required: DB_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Memory mapping to resolve MongoDB ObjectIds to Supabase UUIDs
const userMapping = {};
const facultyMapping = {};
const instituteMapping = {};
const courseMapping = {}; // Key: "facultyMongoId_courseIndex" or standalone course ID -> Supabase UUID

/**
 * Download file from URL and upload to Supabase Storage
 * Returns the public URL of the uploaded file.
 */
async function migrateFileToSupabase(url, folderName) {
  if (!url || !url.startsWith('http')) {
    return { publicUrl: url, path: '' };
  }

  try {
    console.log(`   • Downloading image: ${url.substring(0, 60)}...`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate clean file name
    const urlParts = url.split('/');
    const originalName = urlParts[urlParts.length - 1].split('?')[0];
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${folderName}/${Date.now()}_${cleanName}`;

    console.log(`   • Uploading to Supabase Storage: academywale-media/${fileName}`);
    const { data, error } = await supabase.storage
      .from('academywale-media')
      .upload(fileName, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('academywale-media')
      .getPublicUrl(fileName);

    console.log(`   ✅ File migrated successfully! New URL: ${publicUrl}`);
    return { publicUrl, path: fileName };

  } catch (error) {
    console.error(`   ⚠️ Failed to migrate image file: ${error.message}. Keeping original URL.`);
    return { publicUrl: url, path: '' };
  }
}

/**
 * Main Migration Loop
 */
async function runMigration() {
  try {
    // 1. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // 1.5 Clean up existing data in Supabase (in reverse foreign key order)
    console.log('🧹 Cleaning up any existing data in Supabase tables to ensure a clean migration...');
    await supabase.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('faculties').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('institutes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('coupons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Supabase tables cleaned.');

    // 2. Migrate Users
    console.log('\n👤 Migrating Users...');
    const mongoUsers = await User.find({}).select('+password');
    console.log(`Found ${mongoUsers.length} users in MongoDB.`);

    for (const u of mongoUsers) {
      const { data, error } = await supabase
        .from('users')
        .insert({
          mongo_id: u._id.toString(),
          name: u.name,
          email: u.email,
          password: u.password, // Keep bcrypt hashed password
          mobile: u.mobile || null,
          role: u.role || 'user',
          is_active: u.isActive !== undefined ? u.isActive : true,
          created_at: u.createdAt || new Date()
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Error migrating user ${u.email}:`, error.message);
      } else {
        userMapping[u._id.toString()] = data.id;
        console.log(`   • Migrated user: ${u.email} -> UUID: ${data.id}`);
      }
    }

    // 3. Migrate Testimonials
    console.log('\n💬 Migrating Testimonials...');
    const mongoTestimonials = await Testimonial.find({});
    console.log(`Found ${mongoTestimonials.length} testimonials in MongoDB.`);

    for (const t of mongoTestimonials) {
      let imagePath = '';
      let imageUrl = t.imageUrl;
      if (t.imageUrl) {
        const fileResult = await migrateFileToSupabase(t.imageUrl, 'testimonials');
        imageUrl = fileResult.publicUrl;
        imagePath = fileResult.path;
      }

      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: t.name,
          course: t.course || null,
          message: t.message || t.text || '',
          image: imagePath || t.image || null,
          image_url: imageUrl || null,
          created_at: t.createdAt || new Date()
        });

      if (error) {
        console.error(`❌ Error migrating testimonial for ${t.name}:`, error.message);
      } else {
        console.log(`   • Migrated testimonial: ${t.name}`);
      }
    }

    // 4. Migrate Coupons
    console.log('\n🎫 Migrating Coupons...');
    const mongoCoupons = await Coupon.find({});
    console.log(`Found ${mongoCoupons.length} coupons in MongoDB.`);

    for (const c of mongoCoupons) {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: c.code.toUpperCase(),
          discount_percent: c.discountPercent,
          is_active: c.isActive !== undefined ? c.isActive : true,
          created_at: c.createdAt || new Date()
        });

      if (error) {
        console.error(`❌ Error migrating coupon ${c.code}:`, error.message);
      } else {
        console.log(`   • Migrated coupon: ${c.code}`);
      }
    }

    // 5. Migrate Institutes
    console.log('\n🏫 Migrating Institutes...');
    const mongoInstitutes = await Institute.find({});
    console.log(`Found ${mongoInstitutes.length} institutes in MongoDB.`);

    for (const inst of mongoInstitutes) {
      let logoUrl = inst.imageUrl;
      let logoPath = '';
      if (inst.imageUrl) {
        const fileResult = await migrateFileToSupabase(inst.imageUrl, 'institutes');
        logoUrl = fileResult.publicUrl;
        logoPath = fileResult.path;
      }

      const { data, error } = await supabase
        .from('institutes')
        .insert({
          mongo_id: inst._id.toString(),
          name: inst.name,
          image_url: logoUrl,
          public_id: logoPath || inst.public_id || inst.image || ''
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Error migrating institute ${inst.name}:`, error.message);
      } else {
        instituteMapping[inst._id.toString()] = data.id;
        console.log(`   • Migrated institute: ${inst.name} -> UUID: ${data.id}`);
      }
    }

    // 6. Migrate Faculties
    console.log('\n🧑‍🏫 Migrating Faculties...');
    const mongoFaculties = await Faculty.find({});
    console.log(`Found ${mongoFaculties.length} faculties in MongoDB.`);

    for (const fac of mongoFaculties) {
      let facUrl = fac.imageUrl;
      let facPath = '';
      if (fac.imageUrl) {
        const fileResult = await migrateFileToSupabase(fac.imageUrl, 'faculties');
        facUrl = fileResult.publicUrl;
        facPath = fileResult.path;
      }

      const { data, error } = await supabase
        .from('faculties')
        .insert({
          mongo_id: fac._id.toString(),
          first_name: fac.firstName,
          last_name: fac.lastName || null,
          bio: fac.bio || '',
          teaches: fac.teaches || [],
          image_url: facUrl,
          public_id: facPath || fac.public_id || fac.image || '',
          slug: fac.slug
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Error migrating faculty ${fac.firstName}:`, error.message);
        continue;
      }

      const facultyUuid = data.id;
      facultyMapping[fac._id.toString()] = facultyUuid;
      console.log(`   • Migrated faculty: ${fac.firstName} -> UUID: ${facultyUuid}`);

      // 6a. Migrate Nested Courses for this Faculty
      if (fac.courses && fac.courses.length > 0) {
        console.log(`     📚 Found ${fac.courses.length} courses embedded under faculty ${fac.firstName}. Migrating...`);
        for (let idx = 0; idx < fac.courses.length; idx++) {
          const c = fac.courses[idx];
          
          let posterUrl = c.posterUrl;
          let posterPath = '';
          if (c.posterUrl) {
            const fileResult = await migrateFileToSupabase(c.posterUrl, 'courses');
            posterUrl = fileResult.publicUrl;
            posterPath = fileResult.path;
          }

          // Normalize and transform modeAttemptPricing array
          // Embedded courses structure: modeAttemptPricing: [{ mode, attempts: [{ attempt, costPrice, sellingPrice }] }]
          // We flatten it to: [{ mode, attempt, costPrice, sellingPrice }] for canonical structure
          const flatPricing = [];
          if (c.modeAttemptPricing && Array.isArray(c.modeAttemptPricing)) {
            c.modeAttemptPricing.forEach(modeItem => {
              const modeVal = modeItem.mode || '';
              if (modeItem.attempts && Array.isArray(modeItem.attempts)) {
                modeItem.attempts.forEach(attItem => {
                  flatPricing.push({
                    mode: modeVal,
                    attempt: attItem.attempt || '',
                    costPrice: attItem.costPrice || 0,
                    sellingPrice: attItem.sellingPrice || 0
                  });
                });
              } else if (modeItem.attempt) {
                // Already flat fallback
                flatPricing.push({
                  mode: modeVal,
                  attempt: modeItem.attempt,
                  costPrice: modeItem.costPrice || 0,
                  sellingPrice: modeItem.sellingPrice || 0
                });
              }
            });
          }

          // Resolve institute
          let instId = null;
          let instName = c.institute || '';
          if (c.institute) {
            // Find institute by name to resolve FK
            const matchingInst = await Institute.findOne({ name: c.institute });
            if (matchingInst && instituteMapping[matchingInst._id.toString()]) {
              instId = instituteMapping[matchingInst._id.toString()];
            }
          }

          const { data: courseData, error: courseErr } = await supabase
            .from('courses')
            .insert({
              mongo_id: fac._id.toString() + '_' + idx,
              title: c.title || c.subject || 'Untitled Course',
              subject: c.subject,
              description: c.description || '',
              category: c.category ? c.category.toUpperCase() : '',
              subcategory: c.subcategory ? c.subcategory.charAt(0).toUpperCase() + c.subcategory.slice(1).toLowerCase() : '',
              paper_id: c.paperId !== undefined ? String(c.paperId) : '',
              paper_name: c.paperName || '',
              course_type: c.courseType || 'General Course',
              no_of_lecture: c.noOfLecture || '',
              books: c.books || '',
              video_language: c.videoLanguage || 'Hindi',
              video_run_on: c.videoRunOn || '',
              timing: c.timing || '',
              doubt_solving: c.doubtSolving || '',
              support_mail: c.supportMail || '',
              support_call: c.supportCall || '',
              validity_start_from: c.validityStartFrom || '',
              faculty_id: facultyUuid,
              faculty_name: `${fac.firstName}${fac.lastName ? ' ' + fac.lastName : ''}`,
              faculty_slug: fac.slug,
              institute_id: instId,
              institute_name: instName,
              poster_url: posterUrl,
              poster_public_id: posterPath,
              mode_attempt_pricing: flatPricing,
              cost_price: c.costPrice || 0,
              selling_price: c.sellingPrice || 0,
              is_active: c.isActive !== undefined ? c.isActive : true
            })
            .select('id')
            .single();

          if (courseErr) {
            console.error(`     ❌ Error migrating embedded course index ${idx}:`, courseErr.message);
          } else {
            const courseUuid = courseData.id;
            courseMapping[`${fac._id.toString()}_${idx}`] = courseUuid;
            console.log(`     • Migrated Course: "${c.subject}" -> UUID: ${courseUuid}`);
          }
        }
      }
    }

    // 7. Migrate Standalone Courses (if any were not linked or exist independently in Course collection)
    console.log('\n📚 Checking Standalone Course Collection for any additional records...');
    const mongoCourses = await Course.find({});
    console.log(`Found ${mongoCourses.length} standalone courses in MongoDB.`);

    for (const c of mongoCourses) {
      // Find if we already migrated it (e.g. check by matching subject and faculty slug)
      const matchingFaculty = c.facultySlug ? await Faculty.findOne({ slug: c.facultySlug }) : null;
      let alreadyMigrated = false;

      if (matchingFaculty) {
        // If we migrated courses for this faculty, check if we created one that matches the subject
        // To be safe, we check if it is already in our courseMapping
        // standalone courses may be stored independently. Let's see if we should import them.
        const { data: existing } = await supabase
          .from('courses')
          .select('id')
          .eq('subject', c.subject)
          .eq('faculty_slug', c.facultySlug || '')
          .limit(1);

        if (existing && existing.length > 0) {
          alreadyMigrated = true;
          courseMapping[c._id.toString()] = existing[0].id;
        }
      }

      if (!alreadyMigrated) {
        console.log(`   • Migrating additional course: "${c.title}"`);
        let posterUrl = c.posterUrl;
        let posterPath = '';
        if (c.posterUrl) {
          const fileResult = await migrateFileToSupabase(c.posterUrl, 'courses');
          posterUrl = fileResult.publicUrl;
          posterPath = fileResult.path;
        }

        // Standalone course has flat modeAttemptPricing: [{ mode, attempt, costPrice, sellingPrice }]
        const flatPricing = c.modeAttemptPricing || [];

        // Resolve faculty
        let facId = null;
        if (matchingFaculty && facultyMapping[matchingFaculty._id.toString()]) {
          facId = facultyMapping[matchingFaculty._id.toString()];
        }

        // Resolve institute
        let instId = null;
        if (c.institute) {
          const matchingInst = await Institute.findOne({ name: c.institute });
          if (matchingInst && instituteMapping[matchingInst._id.toString()]) {
            instId = instituteMapping[matchingInst._id.toString()];
          }
        }

        const { data: courseData, error: courseErr } = await supabase
          .from('courses')
          .insert({
            mongo_id: c._id.toString(),
            title: c.title || c.subject || 'Untitled Course',
            subject: c.subject,
            description: c.description || '',
            category: c.category ? c.category.toUpperCase() : '',
            subcategory: c.subcategory ? c.subcategory.charAt(0).toUpperCase() + c.subcategory.slice(1).toLowerCase() : '',
            paper_id: c.paperId !== undefined ? String(c.paperId) : '',
            paper_name: c.paperName || '',
            course_type: c.courseType || 'General Course',
            no_of_lecture: c.noOfLecture || '',
            books: c.books || '',
            video_language: c.videoLanguage || 'Hindi',
            video_run_on: c.videoRunOn || '',
            timing: c.timing || '',
            doubt_solving: c.doubtSolving || '',
            support_mail: c.supportMail || '',
            support_call: c.supportCall || '',
            validity_start_from: c.validityStartFrom || '',
            faculty_id: facId,
            faculty_name: c.facultyName || '',
            faculty_slug: c.facultySlug || '',
            institute_id: instId,
            institute_name: c.institute || '',
            poster_url: posterUrl,
            poster_public_id: posterPath,
            mode_attempt_pricing: flatPricing,
            cost_price: c.costPrice || 0,
            selling_price: c.sellingPrice || 0,
            is_active: c.isActive !== undefined ? c.isActive : true
          })
          .select('id')
          .single();

        if (courseErr) {
          console.error(`   ❌ Error migrating additional course ${c.title}:`, courseErr.message);
        } else {
          courseMapping[c._id.toString()] = courseData.id;
          console.log(`   ✅ Migrated additional course: "${c.title}" -> UUID: ${courseData.id}`);
        }
      }
    }

    // 8. Migrate Purchases
    console.log('\n💳 Migrating Purchases...');
    const mongoPurchases = await Purchase.find({});
    console.log(`Found ${mongoPurchases.length} purchases in MongoDB.`);

    for (const p of mongoPurchases) {
      const userUuid = userMapping[p.userId.toString()];
      const facultyUuid = facultyMapping[p.facultyId.toString()];
      
      // Resolve course UUID via composite key
      let courseUuid = courseMapping[`${p.facultyId.toString()}_${p.courseIndex}`];
      
      // Fallback matching by subject if composite fails
      if (!courseUuid) {
        console.log(`   ⚠️ Course index mapping failed for purchase. Attempting title/subject lookup...`);
        const { data: matches } = await supabase
          .from('courses')
          .select('id')
          .eq('faculty_id', facultyUuid)
          .eq('subject', p.courseDetails?.subject || '')
          .limit(1);

        if (matches && matches.length > 0) {
          courseUuid = matches[0].id;
        }
      }

      if (!userUuid || !courseUuid || !facultyUuid) {
        console.error(`   ❌ Cannot migrate purchase ${p._id}: Missing references. User: ${userUuid ? 'OK' : 'MISSING'}, Course: ${courseUuid ? 'OK' : 'MISSING'}, Faculty: ${facultyUuid ? 'OK' : 'MISSING'}`);
        continue;
      }

      const { error } = await supabase
        .from('purchases')
        .insert({
          mongo_id: p._id.toString(),
          user_id: userUuid,
          course_id: courseUuid,
          faculty_id: facultyUuid,
          course_details: p.courseDetails,
          purchase_date: p.purchaseDate || new Date(),
          payment_status: p.paymentStatus || 'pending',
          payment_method: p.paymentMethod || 'online',
          amount: p.amount,
          transaction_id: p.transactionId || null,
          access_expiry: p.accessExpiry || null,
          is_active: p.isActive !== undefined ? p.isActive : true,
          created_at: p.createdAt || new Date()
        });

      if (error) {
        console.error(`   ❌ Error migrating purchase ID ${p._id}:`, error.message);
      } else {
        console.log(`   • Migrated purchase: User UUID ${userUuid.substring(0,8)} bought Course UUID ${courseUuid.substring(0,8)}`);
      }
    }

    console.log('\n🎉 ALL DATA MIGRATION TASKS COMPLETED SUCCESSFULLY!');

  } catch (err) {
    console.error('❌ MIGRATION FAILED WITH GLOBAL ERROR:', err);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Closed MongoDB Connection');
  }
}

// Start
runMigration();
