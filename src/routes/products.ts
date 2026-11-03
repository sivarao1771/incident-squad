import { Router } from 'express';
import { getProduct, listProducts } from '../store';

export const productsRouter = Router();

productsRouter.get('/', (_req, res) => {
  res.json(listProducts());
});

productsRouter.get('/:id', (req, res) => {
  const product = getProduct(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});
