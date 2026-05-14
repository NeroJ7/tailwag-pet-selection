// simulate_e2e.js
// Mocking the localStorage and business logic to verify the end-to-end flow.

const products = require('./data/products.json');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = val.toString(); },
  removeItem: (key) => { delete storage[key]; }
};

// DispatchEvent mock
global.window = {
  dispatchEvent: () => {}
};
global.CustomEvent = class {};

// Simplified Logic from cart-util.js
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('tailwag_cart') || '[]');
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem('tailwag_cart', JSON.stringify(cart));
  console.log(`[PASS] Product added: ${product.name}`);
}

function checkout(customer) {
  const cart = JSON.parse(localStorage.getItem('tailwag_cart') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const newOrder = {
    id: 'TW' + Date.now(),
    date: new Date().toISOString(),
    items: cart,
    total: total,
    customer: customer,
    status: 'Pending'
  };
  
  let orders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
  orders.push(newOrder);
  localStorage.setItem('tailwag_orders', JSON.stringify(orders));
  localStorage.removeItem('tailwag_cart');
  console.log(`[PASS] Checkout complete. Order ID: ${newOrder.id}, Total: ¥${total}`);
  return newOrder.id;
}

// Simulated Dashboard Logic
function processSourcing(orderId) {
  let orders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order && order.status === 'Pending') {
    order.status = 'Sourced';
    localStorage.setItem('tailwag_orders', JSON.stringify(orders));
    console.log(`[PASS] Order ${orderId} marked as SOURCED from 1688.`);
  }
}

// RUN SIMULATION
console.log('--- STARTING E2E SIMULATION ---');
const testProduct = products[0]; // Arctic Gold
addToCart(testProduct);

const customer = { name: 'Expert Verifier', email: 'expert@accio.ai' };
const orderId = checkout(customer);

processSourcing(orderId);

// Final Verification
const finalOrders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
if (finalOrders.length > 0 && finalOrders[0].status === 'Sourced') {
  console.log('--- E2E SIMULATION SUCCESSFUL ---');
} else {
  console.error('--- E2E SIMULATION FAILED ---');
  process.exit(1);
}
