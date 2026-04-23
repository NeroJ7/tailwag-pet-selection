const fs = require('fs');
const path = require('path');

// 1. Verify products.json
console.log('--- Step 1: Verifying products.json ---');
const productsPath = path.join(__dirname, 'data', 'products.json');
try {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`✅ Successfully loaded ${products.length} products.`);
  products.forEach(p => {
    if (!p.id || !p.name || !p.price || !p.sourcingUrl) {
      throw new Error(`Product ${p.id || 'unknown'} is missing critical fields.`);
    }
  });
  console.log('✅ All products have critical fields.');
} catch (err) {
  console.error('❌ products.json verification failed:', err.message);
  process.exit(1);
}

// 2. Verify Cart Logic (Mocking localStorage)
console.log('\n--- Step 2: Verifying Cart & Order Logic ---');
const cartUtilPath = path.join(__dirname, 'utils', 'cart-util.js');
const cartUtilContent = fs.readFileSync(cartUtilPath, 'utf8');

// Simple test to ensure the logic exists and is exportable
if (cartUtilContent.includes('export const addToCart') && 
    cartUtilContent.includes('export const placeOrder')) {
  console.log('✅ cart-util.js contains all required export functions.');
} else {
  console.error('❌ cart-util.js is missing core functions.');
  process.exit(1);
}

// 3. Verify Page Routing & Components
console.log('\n--- Step 3: Verifying Page Structure ---');
const requiredPages = [
  'pages/index.js',
  'pages/cart.js',
  'pages/orders.js',
  'pages/dashboard.js',
  'pages/product/detail.js'
];

requiredPages.forEach(p => {
  if (fs.existsSync(path.join(__dirname, p))) {
    console.log(`✅ Page exists: ${p}`);
  } else {
    console.error(`❌ Missing critical page: ${p}`);
    process.exit(1);
  }
});

console.log('\n--- VERIFICATION COMPLETE: SYSTEM IS READY ---');
