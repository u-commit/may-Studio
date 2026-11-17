import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createVariant,
  deleteVariant,
  addVariantImage,
  getProductVariants,
  removeVariantImage,
  saveProductVariants,
  setPrimaryVariantImage,
  updateVariant,
} from './variantService.js';

test('mock service creates, edits, bulk saves, deletes, and orders variant photos', async () => {
  const product = { id: 'TEST-MAY001', name: 'Áo thử nghiệm', price: 350000 };
  const initial = await getProductVariants(product.id, product);
  assert.equal(initial.length, 6);
  assert.equal(
    initial.reduce((sum, item) => sum + item.stock, 0),
    125
  );

  const created = await createVariant(product.id, {
    sku: 'TEST-MAY001-GREEN-XL',
    color: { name: 'Xanh lá' },
    size: 'XL',
    price: 400000,
    salePrice: null,
    stock: 0,
    isActive: true,
    images: ['image-a', 'image-b'],
  });
  assert.ok(created.id);

  const otherProduct = {
    id: 'TEST-MAY002',
    name: 'Sản phẩm khác',
    price: 280000,
  };
  const otherProductVariant = await createVariant(otherProduct.id, {
    sku: 'TEST-MAY002-BE-S',
    color: { name: 'Be' },
    size: 'S',
    price: 280000,
    salePrice: null,
    stock: 2,
    isActive: true,
    images: [],
  });

  await updateVariant(product.id, created.id, { stock: 4 });
  let current = await getProductVariants(product.id, product);
  const edited = current.find((item) => item.id === created.id);
  assert.equal(edited.stock, 4);

  await addVariantImage(product.id, created.id, 'image-c');
  current = await getProductVariants(product.id, product);
  assert.deepEqual(current.find((item) => item.id === created.id).images, [
    'image-a',
    'image-b',
    'image-c',
  ]);
  await removeVariantImage(product.id, created.id, 2);

  await setPrimaryVariantImage(product.id, created.id, 1);
  current = await getProductVariants(product.id, product);
  assert.equal(
    current.find((item) => item.id === created.id).images[0],
    'image-b'
  );

  const bulk = current.map((item) =>
    item.id === created.id ? { ...item, price: 410000 } : item
  );
  await saveProductVariants(product.id, bulk);
  current = await getProductVariants(product.id, product);
  assert.equal(current.find((item) => item.id === created.id).price, 410000);

  await deleteVariant(product.id, created.id);
  current = await getProductVariants(product.id, product);
  assert.equal(
    current.some((item) => item.id === created.id),
    false
  );
  const otherProductVariants = await getProductVariants(
    otherProduct.id,
    otherProduct
  );
  assert.ok(
    otherProductVariants.some((item) => item.id === otherProductVariant.id)
  );
  await deleteVariant(otherProduct.id, otherProductVariant.id);
});
