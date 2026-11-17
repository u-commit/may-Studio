import {
  createVariantId,
  getColorHex,
  getProductVariants as readLegacyVariants,
  PRODUCT_VARIANTS_STORAGE_KEY,
  saveProductVariants as writeLegacyVariants,
} from './productVariantsService.js';
import { MOCK_VARIANTS } from '../mocks/variantMock.js';
import {
  hasVariantErrors,
  validateVariants,
} from '../utils/variantValidation.js';

// One switch selects the future API adapter; endpoints are not available yet.
export const USE_MOCK_VARIANT_API = true;
export const VARIANT_MOCK_DELAY_MS = 80;
const MOCK_SEED_KEY = `${PRODUCT_VARIANTS_STORAGE_KEY}:seeded-v1`;
let memoryVariants = [];
let memorySeeded = false;

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, VARIANT_MOCK_DELAY_MS));
const getApiClient = async () => (await import('./axiosClient.js')).default;
const clone = (items) =>
  items.map((item) => ({
    ...item,
    color:
      typeof item.color === 'string'
        ? { name: item.color }
        : { ...(item.color ?? {}) },
    images: [...(item.images ?? (item.image ? [item.image] : []))],
  }));

function normalizeVariant(variant) {
  const images = [
    ...(variant.images ?? (variant.image ? [variant.image] : [])),
  ];
  const isActive = Boolean(variant.isActive ?? variant.status === 'active');
  const color =
    typeof variant.color === 'string'
      ? { name: variant.color }
      : (variant.color ?? {});
  return {
    ...variant,
    id: String(variant.id ?? createVariantId()),
    productId: String(variant.productId),
    sku: String(variant.sku ?? ''),
    color: {
      ...color,
      name: String(color.name ?? ''),
      hex: color.hex || getColorHex(color.name),
    },
    size: String(variant.size ?? ''),
    price: Number(variant.price) || 0,
    salePrice:
      variant.salePrice === '' || variant.salePrice == null
        ? null
        : Number(variant.salePrice),
    stock: Math.max(0, Number(variant.stock) || 0),
    isActive,
    status: isActive ? 'active' : 'inactive',
    images,
    image: images[0] ?? '',
  };
}

/**
 * Backend DTO: { id, productId, color, size, sku, price, salePrice, stock,
 * isActive, images }. The client keeps color.name/hex and legacy status/image
 * fields internally so the existing storefront remains compatible.
 */
function toVariantDto(variant) {
  return {
    id: variant.id,
    productId: variant.productId,
    color: variant.color?.name ?? variant.color,
    size: variant.size,
    sku: variant.sku,
    price: variant.price,
    salePrice: variant.salePrice,
    stock: variant.stock,
    isActive: variant.isActive,
    images: [...(variant.images ?? [])],
  };
}

function getStoredVariants(products = []) {
  if (typeof window === 'undefined') return clone(memoryVariants);
  if (products.length)
    return readLegacyVariants(products).map(normalizeVariant);
  try {
    const raw = window.localStorage.getItem(PRODUCT_VARIANTS_STORAGE_KEY);
    return (raw ? JSON.parse(raw) : []).map(normalizeVariant);
  } catch {
    return [];
  }
}

function persistVariants(variants) {
  const normalized = variants.map(normalizeVariant);
  if (typeof window === 'undefined') {
    memoryVariants = clone(normalized);
    return true;
  }
  return writeLegacyVariants(normalized);
}

function getMockTemplate(product, index) {
  const id = String(product.id ?? product._id ?? product.productId ?? '');
  const templateIndex = ['MAY001', 'MAY002', 'MAY003', 'MAY004'].indexOf(id);
  const resolvedIndex = templateIndex >= 0 ? templateIndex : index;
  return MOCK_VARIANTS.filter(
    (item) => item.productId === `MAY00${resolvedIndex + 1}`
  ).map((item) =>
    normalizeVariant({
      ...item,
      id:
        id === item.productId ? item.id : `${id}-variant-${item.id.slice(-2)}`,
      productId: id,
      productName: product.name ?? product.productName ?? item.productName,
    })
  );
}

function seedMockVariants(products = []) {
  if (!products.length) return;
  if (typeof window === 'undefined') {
    if (memorySeeded) return;
    if (memoryVariants.length) {
      memorySeeded = true;
      return;
    }
    memoryVariants = products.flatMap(getMockTemplate);
    memorySeeded = true;
    return;
  }

  try {
    if (window.localStorage.getItem(MOCK_SEED_KEY)) return;
    const existing = getStoredVariants();
    if (!existing.length) {
      const seeded = products.flatMap(getMockTemplate);
      if (!writeLegacyVariants(seeded)) return;
    }
    window.localStorage.setItem(MOCK_SEED_KEY, 'true');
  } catch {
    // The UI can still be used for this session if browser storage is unavailable.
  }
}

function emitVariantChange(variants) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('may-studio:variant-service-updated', {
        detail: variants,
      })
    );
  }
}

function getMockVariantsForProduct(productId) {
  return getStoredVariants().filter(
    (item) => String(item.productId) === String(productId)
  );
}

async function mockGetAllVariants(products) {
  await wait();
  seedMockVariants(products);
  return getStoredVariants(products);
}

export async function getProductVariants(productId, product) {
  if (USE_MOCK_VARIANT_API) {
    if (product) seedMockVariants([product]);
    await wait();
    return getMockVariantsForProduct(productId);
  }
  const response = await (
    await getApiClient()
  ).get(`/product/${productId}/variants`);
  return (response.data?.variants ?? response.data ?? []).map(normalizeVariant);
}

export async function getVariantsForProducts(products = []) {
  if (USE_MOCK_VARIANT_API) return mockGetAllVariants(products);
  const results = await Promise.all(
    products.map((product) => getProductVariants(product.id, product))
  );
  return results.flat();
}

export async function saveProductVariants(
  productId,
  nextVariants,
  products = []
) {
  const savedVariants = USE_MOCK_VARIANT_API ? getStoredVariants(products) : [];
  const normalizedIds = new Set(nextVariants.map((item) => item.id));
  const existing = savedVariants.filter((item) => !normalizedIds.has(item.id));
  const errors = validateVariants(nextVariants, existing, productId);
  if (hasVariantErrors(errors)) {
    const error = new Error('Dữ liệu biến thể chưa hợp lệ.');
    error.fieldErrors = errors;
    throw error;
  }
  const normalized = nextVariants.map((item) =>
    normalizeVariant({ ...item, productId })
  );

  if (USE_MOCK_VARIANT_API) {
    await wait();
    const kept = getStoredVariants(products).filter(
      (item) => String(item.productId) !== String(productId)
    );
    const saved = [...kept, ...normalized];
    if (!persistVariants(saved))
      throw new Error('Không thể lưu dữ liệu biến thể.');
    emitVariantChange(saved);
    return clone(normalized);
  }
  const response = await (
    await getApiClient()
  ).put(`/product/${productId}/variants/bulk`, {
    variants: normalized.map(toVariantDto),
  });
  return (response.data?.variants ?? normalized).map(normalizeVariant);
}

export async function createVariant(productId, variant, products = []) {
  const current = await getProductVariants(
    productId,
    products.find((item) => String(item.id) === String(productId))
  );
  const created = normalizeVariant({
    ...variant,
    id: createVariantId(),
    productId,
  });
  await saveProductVariants(productId, [...current, created], products);
  return created;
}

export async function updateVariant(
  productId,
  variantId,
  changes,
  products = []
) {
  const current = await getProductVariants(
    productId,
    products.find((item) => String(item.id) === String(productId))
  );
  const updated = current.map((item) =>
    item.id === variantId ? normalizeVariant({ ...item, ...changes }) : item
  );
  await saveProductVariants(productId, updated, products);
  return updated.find((item) => item.id === variantId);
}

export async function deleteVariant(productId, variantId, products = []) {
  const current = await getProductVariants(
    productId,
    products.find((item) => String(item.id) === String(productId))
  );
  await saveProductVariants(
    productId,
    current.filter((item) => item.id !== variantId),
    products
  );
}

async function changeVariantImages(
  productId,
  variantId,
  change,
  products = []
) {
  const current = await getProductVariants(
    productId,
    products.find((item) => String(item.id) === String(productId))
  );
  const updated = current.map((item) =>
    item.id === variantId
      ? normalizeVariant({ ...item, images: change(item.images) })
      : item
  );
  await saveProductVariants(productId, updated, products);
  return updated.find((item) => item.id === variantId);
}

export function addVariantImage(productId, variantId, image, products = []) {
  return changeVariantImages(
    productId,
    variantId,
    (images) => [...images, image],
    products
  );
}

export function removeVariantImage(
  productId,
  variantId,
  imageIndex,
  products = []
) {
  return changeVariantImages(
    productId,
    variantId,
    (images) => images.filter((_, index) => index !== imageIndex),
    products
  );
}

export function setPrimaryVariantImage(
  productId,
  variantId,
  imageIndex,
  products = []
) {
  return changeVariantImages(
    productId,
    variantId,
    (images) => {
      if (imageIndex < 0 || imageIndex >= images.length) return images;
      return [
        images[imageIndex],
        ...images.filter((_, index) => index !== imageIndex),
      ];
    },
    products
  );
}
