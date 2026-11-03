// In-memory data store for the mini-shop. No database, so the demo runs anywhere.

export interface Product {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  cartId: string;
  items: CartItem[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  coupon?: string;
  createdAt: string;
}

const SEED_PRODUCTS: Product[] = [
  { id: 'p-100', name: 'Mechanical Keyboard', priceCents: 8999, stock: 10 },
  { id: 'p-200', name: 'USB-C Hub', priceCents: 3499, stock: 25 },
  { id: 'p-300', name: 'Noise-Cancelling Headphones', priceCents: 19999, stock: 5 },
  { id: 'p-400', name: 'Laptop Stand', priceCents: 2999, stock: 0 },
];

let products = new Map<string, Product>();
let carts = new Map<string, Cart>();
let orders = new Map<string, Order>();
let nextId = 1;

export function resetStore(): void {
  products = new Map(SEED_PRODUCTS.map((p) => [p.id, { ...p }]));
  carts = new Map();
  orders = new Map();
  nextId = 1;
}

export function newId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

export function listProducts(): Product[] {
  return [...products.values()].map((p) => ({ ...p }));
}

export function getProduct(id: string): Product | undefined {
  const p = products.get(id);
  return p ? { ...p } : undefined;
}

export function saveProduct(product: Product): void {
  products.set(product.id, { ...product });
}

export function createCart(): Cart {
  const cart: Cart = { id: newId('cart'), items: [] };
  carts.set(cart.id, cart);
  return cart;
}

export function getCart(id: string): Cart | undefined {
  return carts.get(id);
}

export function deleteCart(id: string): void {
  carts.delete(id);
}

export function saveOrder(order: Order): void {
  orders.set(order.id, order);
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

resetStore();
