const fs = require('fs');
const path = require('path');
const { supabaseAdmin } = require('../config/supabase.config');

const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'coupons_metadata.json');

let inMemoryStore = null;

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
  }
}

function getMetadataStore() {
  if (inMemoryStore !== null) {
    return inMemoryStore;
  }
  try {
    ensureStore();
    const raw = fs.readFileSync(filePath, 'utf8');
    inMemoryStore = JSON.parse(raw || '{}');
    return inMemoryStore;
  } catch (err) {
    console.error('Error reading coupon metadata store:', err);
    inMemoryStore = {};
    return inMemoryStore;
  }
}

async function syncFromSupabase() {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('message')
      .eq('name', '__COUPON_METADATA__')
      .maybeSingle();

    if (!error && data && data.message) {
      const remoteStore = JSON.parse(data.message || '{}');
      const localStore = getMetadataStore();
      const merged = { ...localStore, ...remoteStore };
      inMemoryStore = merged;
      saveMetadataStore(merged, false);
    }
  } catch (err) {
    console.error('Failed to sync coupon metadata from Supabase DB:', err.message);
  }
}

function saveMetadataStore(store, pushToSupabase = true) {
  try {
    ensureStore();
    inMemoryStore = store;
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
    if (pushToSupabase) {
      pushMetadataToSupabase(store);
    }
  } catch (err) {
    console.error('Error saving coupon metadata store:', err);
  }
}

async function pushMetadataToSupabase(store) {
  try {
    const jsonStr = JSON.stringify(store || {});
    const { data: existing } = await supabaseAdmin
      .from('testimonials')
      .select('id')
      .eq('name', '__COUPON_METADATA__')
      .maybeSingle();

    if (existing && existing.id) {
      await supabaseAdmin
        .from('testimonials')
        .update({ message: jsonStr })
        .eq('id', existing.id);
    } else {
      await supabaseAdmin
        .from('testimonials')
        .insert({
          name: '__COUPON_METADATA__',
          message: jsonStr
        });
    }
  } catch (err) {
    console.error('Error pushing coupon metadata to Supabase DB:', err.message);
  }
}

// Perform initial sync from Supabase DB asynchronously
syncFromSupabase();

function setCouponMetadata(code, meta) {
  const store = getMetadataStore();
  const normalized = String(code || '').trim().toUpperCase();
  store[normalized] = {
    ...store[normalized],
    ...meta,
    updatedAt: new Date().toISOString()
  };
  saveMetadataStore(store);
}

function getCouponMetadata(code) {
  const store = getMetadataStore();
  const normalized = String(code || '').trim().toUpperCase();
  return store[normalized] || null;
}

function deleteCouponMetadata(code) {
  const store = getMetadataStore();
  const normalized = String(code || '').trim().toUpperCase();
  if (store[normalized]) {
    delete store[normalized];
    saveMetadataStore(store);
  }
}

function hasUsedCoupon(code, userId, userEmail) {
  const meta = getCouponMetadata(code);
  if (!meta || !Array.isArray(meta.usedBy)) return false;
  const targetId = userId ? String(userId).trim().toLowerCase() : null;
  const targetEmail = userEmail ? String(userEmail).trim().toLowerCase() : null;
  return meta.usedBy.some(entry => {
    const sEntry = String(entry).trim().toLowerCase();
    return (targetId && sEntry === targetId) || (targetEmail && sEntry === targetEmail);
  });
}

function recordCouponUsage(code, userId, userEmail) {
  if (!code) return;
  const store = getMetadataStore();
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return;
  
  if (!store[normalized]) {
    store[normalized] = {
      exactDiscountPercent: null,
      courseId: null,
      message: null,
      isVisible: true
    };
  }

  const usedBy = Array.isArray(store[normalized].usedBy) ? store[normalized].usedBy : [];
  if (userId && !usedBy.includes(String(userId).trim())) {
    usedBy.push(String(userId).trim());
  }
  if (userEmail && !usedBy.includes(String(userEmail).trim().toLowerCase())) {
    usedBy.push(String(userEmail).trim().toLowerCase());
  }
  store[normalized].usedBy = usedBy;
  store[normalized].updatedAt = new Date().toISOString();
  saveMetadataStore(store);
}

module.exports = {
  getMetadataStore,
  setCouponMetadata,
  getCouponMetadata,
  deleteCouponMetadata,
  hasUsedCoupon,
  recordCouponUsage,
  syncFromSupabase
};

