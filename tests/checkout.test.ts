import request from 'supertest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';

const app = createApp();

beforeEach(() => resetStore());

async function cartWith(items: { productId: string; quantity: number }[]): Promise<string> {
  const { body } = await request(app).post('/cart');
  for (const item of items) {
    await request(app).post(`/cart/${body.id}/items`).send(item);
  }
  return body.id;
}

describe('checkout', () => {
  it('places an order and totals it', async () => {
    const cartId = await cartWith([
      { productId: 'p-100', quantity: 1 },
      { productId: 'p-200', quantity: 2 },
    ]);
    const res = await request(app).post('/checkout').send({ cartId });
    expect(res.status).toBe(201);
    expect(res.body.subtotalCents).toBe(8999 + 2 * 3499);
    expect(res.body.discountCents).toBe(0);
    expect(res.body.totalCents).toBe(res.body.subtotalCents);
  });

  it('removes the cart after checkout', async () => {
    const cartId = await cartWith([{ productId: 'p-200', quantity: 1 }]);
    await request(app).post('/checkout').send({ cartId });
    const res = await request(app).get(`/cart/${cartId}`);
    expect(res.status).toBe(404);
  });

  it('lets you fetch the order afterwards', async () => {
    const cartId = await cartWith([{ productId: 'p-200', quantity: 1 }]);
    const placed = await request(app).post('/checkout').send({ cartId });
    const res = await request(app).get(`/checkout/orders/${placed.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(placed.body.id);
  });

  it('rejects an unknown coupon', async () => {
    const cartId = await cartWith([{ productId: 'p-200', quantity: 1 }]);
    const res = await request(app).post('/checkout').send({ cartId, coupon: 'FREESTUFF' });
    expect(res.status).toBe(400);
  });

  it('404s for an unknown cart', async () => {
    const res = await request(app).post('/checkout').send({ cartId: 'cart-999' });
    expect(res.status).toBe(404);
  });
});
