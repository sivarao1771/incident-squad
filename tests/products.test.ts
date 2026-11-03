import request from 'supertest';
import { createApp } from '../src/app';
import { resetStore } from '../src/store';

const app = createApp();

beforeEach(() => resetStore());

describe('products', () => {
  it('reports health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('lists the catalogue', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body[0]).toMatchObject({ id: 'p-100', name: 'Mechanical Keyboard' });
  });

  it('returns a single product', async () => {
    const res = await request(app).get('/products/p-200');
    expect(res.status).toBe(200);
    expect(res.body.priceCents).toBe(3499);
  });

  it('404s for an unknown product', async () => {
    const res = await request(app).get('/products/nope');
    expect(res.status).toBe(404);
  });
});
