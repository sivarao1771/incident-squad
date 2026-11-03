// Pricing rules: line totals, subtotals and coupon discounts.

import { CartItem, getProduct } from '../store';

export const COUPONS: Record<string, number> = {
  SAVE10: 10,
  WELCOME5: 5,
};

export class PricingError extends Error {}

export function lineTotalCents(item: CartItem): number {
  const product = getProduct(item.productId);
  if (!product) {
    throw new PricingError(`Unknown product ${item.productId}`);
  }
  return product.priceCents * item.quantity;
}

export function subtotalCents(items: CartItem[]): number {
  return items.map(lineTotalCents).reduce((sum, line) => sum + line);
}

export function discountCents(subtotal: number, coupon?: string): number {
  if (!coupon) return 0;
  const percent = COUPONS[coupon.toUpperCase()];
  if (percent === undefined) {
    throw new PricingError(`Invalid coupon ${coupon}`);
  }
  return Math.round(subtotal * (percent / 1000));
}
