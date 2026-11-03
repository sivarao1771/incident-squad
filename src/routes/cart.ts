import { Router } from 'express';
import { createCart, getCart, getProduct } from '../store';

export const cartRouter = Router();

cartRouter.post('/', (_req, res) => {
  res.status(201).json(createCart());
});

cartRouter.get('/:id', (req, res) => {
  const cart = getCart(req.params.id);
  if (!cart) {
    res.status(404).json({ error: 'Cart not found' });
    return;
  }
  res.json(cart);
});

cartRouter.post('/:id/items', (req, res) => {
  const cart = getCart(req.params.id);
  if (!cart) {
    res.status(404).json({ error: 'Cart not found' });
    return;
  }

  const { productId, quantity } = req.body ?? {};
  if (typeof productId !== 'string' || !Number.isInteger(quantity) || quantity < 1) {
    res.status(400).json({ error: 'productId (string) and quantity (integer >= 1) are required' });
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = cart.items.find((i) => i.productId === productId);
  const wanted = (existing?.quantity ?? 0) + quantity;
  if (wanted > product.stock) {
    res.status(409).json({ error: `Only ${product.stock} of ${product.name} in stock` });
    return;
  }

  if (existing) {
    existing.quantity = wanted;
  } else {
    cart.items.push({ productId, quantity });
  }
  res.status(201).json(cart);
});

cartRouter.delete('/:id/items/:productId', (req, res) => {
  const cart = getCart(req.params.id);
  if (!cart) {
    res.status(404).json({ error: 'Cart not found' });
    return;
  }
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  res.json(cart);
});
