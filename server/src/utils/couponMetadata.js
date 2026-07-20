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

module.exports = {
  getMetadataStore,
  setCouponMetadata,
  getCouponMetadata,
  deleteCouponMetadata
};
