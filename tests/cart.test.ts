import request from 'supertest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';

const app = createApp();

beforeEach(() => resetStore());

async function newCart(): Promise<string> {
  const res = await request(app).post('/cart');
  return res.body.id;
}

describe('cart', () => {
  it('creates an empty cart', async () => {
    const res = await request(app).post('/cart');
    expect(res.status).toBe(201);
    expect(res.body.items).toEqual([]);
  });

  it('adds items and merges quantities', async () => {
    const id = await newCart();
    await request(app).post(`/cart/${id}/items`).send({ productId: 'p-200', quantity: 1 });
    const res = await request(app).post(`/cart/${id}/items`).send({ productId: 'p-200', quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.items).toEqual([{ productId: 'p-200', quantity: 3 }]);
  });

  it('rejects bad input', async () => {
    const id = await newCart();
    const res = await request(app).post(`/cart/${id}/items`).send({ productId: 'p-200', quantity: 0 });
    expect(res.status).toBe(400);
  });

  it('rejects out-of-stock products', async () => {
    const id = await newCart();
    const res = await request(app).post(`/cart/${id}/items`).send({ productId: 'p-400', quantity: 1 });
    expect(res.status).toBe(409);
  });

  it('removes an item', async () => {
    const id = await newCart();
    await request(app).post(`/cart/${id}/items`).send({ productId: 'p-100', quantity: 1 });
    const res = await request(app).delete(`/cart/${id}/items/p-100`);
    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
  });

  it('404s for an unknown cart', async () => {
    const res = await request(app).get('/cart/cart-999');
    expect(res.status).toBe(404);
  });
});
