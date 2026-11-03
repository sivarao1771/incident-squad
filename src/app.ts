import express, { NextFunction, Request, Response } from 'express';
import { productsRouter } from './routes/products';
import { cartRouter } from './routes/cart';
import { checkoutRouter } from './routes/checkout';
import { log } from './logger';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/products', productsRouter);
  app.use('/cart', cartRouter);
  app.use('/checkout', checkoutRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    log('error', 'unhandled error', {
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
