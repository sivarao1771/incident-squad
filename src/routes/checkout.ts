import { Router } from 'express';
import { deleteCart, getCart, getOrder, getProduct, newId, Order, saveOrder } from '../store';
import { discountCents, PricingError, subtotalCents } from '../lib/pricing';
import { log } from '../logger';

export const checkoutRouter = Router();

checkoutRouter.post('/', (req, res) => {
  const { cartId, coupon } = req.body ?? {};
  const cart = typeof cartId === 'string' ? getCart(cartId) : undefined;
  if (!cart) {
    res.status(404).json({ error: 'Cart not found' });
    return;
  }

  let subtotal: number;
  let discount: number;
  try {
    subtotal = subtotalCents(cart.items);
    discount = discountCents(subtotal, coupon);
  } catch (err) {
    if (err instanceof PricingError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }

  for (const item of cart.items) {
    const product = getProduct(item.productId)!;
    if (product.stock < item.quantity) {
      res.status(409).json({ error: `Only ${product.stock} of ${product.name} in stock` });
      return;
    }
    product.stock -= item.quantity;
  }

  const order: Order = {
    id: newId('order'),
    cartId: cart.id,
    items: cart.items.map((i) => ({ ...i })),
    subtotalCents: subtotal,
    discountCents: discount,
    totalCents: subtotal - discount,
    coupon: coupon ? String(coupon).toUpperCase() : undefined,
    createdAt: new Date().toISOString(),
  };
  saveOrder(order);
  deleteCart(cart.id);

  log('info', 'order placed', { orderId: order.id, cartId: cart.id, totalCents: order.totalCents });
  res.status(201).json(order);
});

checkoutRouter.get('/orders/:id', (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});
