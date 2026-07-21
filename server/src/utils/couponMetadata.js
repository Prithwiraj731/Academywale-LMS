const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'coupons_metadata.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
  }
}

function getMetadataStore() {
  try {
    ensureStore();
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('Error reading coupon metadata store:', err);
    return {};
  }
}

function saveMetadataStore(store) {
  try {
    ensureStore();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving coupon metadata store:', err);
  }
}

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
  recordCouponUsage
};

