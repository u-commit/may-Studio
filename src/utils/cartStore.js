export const CART_STORAGE_KEY = 'may-studio-cart';
export const CART_EVENT = 'may-studio:cart-updated';

export function getCartItems() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCartItems(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
    return true;
  } catch {
    return false;
  }
}

export function addCartItem(item, quantity = 1) {
  const addedQuantity = Math.max(1, Number(quantity) || 1);
  const current = getCartItems();
  const existing = current.find((cartItem) => cartItem.id === item.id);
  const next = existing
    ? current.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + addedQuantity }
          : cartItem
      )
    : [...current, { ...item, quantity: addedQuantity }];
  return saveCartItems(next);
}

export function updateCartItemQuantity(id, quantity) {
  const next = getCartItems()
    .map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, Number(quantity) || 0) } : item
    )
    .filter((item) => item.quantity > 0);
  return saveCartItems(next);
}

export function removeCartItem(id) {
  return saveCartItems(getCartItems().filter((item) => item.id !== id));
}
