import test from 'node:test';
import assert from 'node:assert/strict';
import { hasVariantErrors, validateVariants } from './variantValidation.js';
import { getVariantSummary } from './variantSummary.js';
import { MOCK_VARIANTS } from '../mocks/variantMock.js';

test('validates required fields, uniqueness, prices, and stock', () => {
  const base = {
    id: 'one',
    productId: 'MAY001',
    sku: '',
    color: { name: '' },
    size: '',
    price: 0,
    salePrice: 0,
    stock: '',
  };
  const errors = validateVariants([base]);
  assert.equal(hasVariantErrors(errors), true);
  assert.ok(errors.one.sku);
  assert.ok(errors.one.color);
  assert.ok(errors.one.size);
  assert.ok(errors.one.price);
  assert.ok(errors.one.salePrice);
  assert.ok(errors.one.stock);
});

test('rejects case-insensitive duplicate SKUs and same-product color-size pairs', () => {
  const rows = [
    {
      id: 'one',
      productId: 'MAY001',
      sku: 'MAY001-W-S',
      color: { name: 'Trắng' },
      size: 'S',
      price: 350000,
      salePrice: null,
      stock: 2,
    },
    {
      id: 'two',
      productId: 'MAY001',
      sku: 'another-sku',
      color: { name: 'trắng' },
      size: 's',
      price: 350000,
      salePrice: null,
      stock: 2,
    },
  ];
  const errors = validateVariants(
    rows,
    [
      {
        id: 'other-product',
        productId: 'MAY002',
        sku: 'may001-w-s',
        color: { name: 'Đen' },
        size: 'L',
      },
    ],
    'MAY001'
  );
  assert.equal(errors.one.sku, 'SKU đã tồn tại.');
  assert.equal(errors.two.combination, 'Màu sắc và kích thước đang bị trùng.');
});

test('summarizes sample product MAY001 from its six variants', () => {
  const summary = getVariantSummary(
    MOCK_VARIANTS.filter((variant) => variant.productId === 'MAY001')
  );
  assert.deepEqual(summary, {
    count: 6,
    stock: 125,
    activeCount: 4,
    status: 'Còn hàng',
    colorSize: 'Trắng, Đen, Be · S, M, L',
  });
});
