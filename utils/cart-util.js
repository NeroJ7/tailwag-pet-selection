export const getCart = () => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('tailwag_cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('tailwag_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item.id !== productId);
  localStorage.setItem('tailwag_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const clearCart = () => {
  localStorage.removeItem('tailwag_cart');
  window.dispatchEvent(new Event('cart-updated'));
};

export const placeOrder = (details) => {
  const cart = getCart();
  if (cart.length === 0) return null;

  const orders = JSON.parse(localStorage.getItem('tailwag_orders') || '[]');
  const newOrder = {
    id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toISOString(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'Pending', // Pending, Sourced, Shipped, Delivered
    customer: details,
    sourcingStatus: 'Ready to Source'
  };

  orders.unshift(newOrder);
  localStorage.setItem('tailwag_orders', JSON.stringify(orders));
  clearCart();
  return newOrder;
};
