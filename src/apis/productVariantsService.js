export const PRODUCT_VARIANTS_STORAGE_KEY = 'may-studio-product-variants';
export const PRODUCT_VARIANTS_EVENT = 'may-studio:product-variants-updated';
const COLOR_HEX = {
  'trắng kem': '#f3eee4',
  trắng: '#ffffff',
  đen: '#000000',
  'vàng bơ': '#ead69b',
  'nâu đất': '#92725d',
  'xanh sage': '#a8b7a0',
  be: '#f5f5dc',
};
export function getColorHex(colorName) {
  const key = String(colorName ?? '').trim().toLocaleLowerCase('vi');
  return COLOR_HEX[key] ?? '#d9dfd8';
}
function slug(value) {
  return String(value ?? '')
    .replace(/[đĐ]/g, (letter) => (letter === 'Đ' ? 'D' : 'd'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLocaleUpperCase()
    .replace(/[^A-Z0-9-]+/g, '-')
    .replace(/^-|-$/g, '');
}
export function createVariantSKU(product, color, size) {
  const ProductCode =
    slug(product?.id ?? product?._id ?? product?.productId) ||
    slug(product?.name) ||
    'SP';
  return `${ProductCode}-${slug(color)}-${slug(size)}`;
}
export const createVarianSKU = createVariantSKU;
export function createVariantId() {
  return (
    globalThis?.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function readStoredVariants() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(PRODUCT_VARIANTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(
          (variant) =>
            variant &&
            typeof variant === 'object' &&
            !Array.isArray(variant) &&
            !isUneditedGeneratedSeed(variant)
        )
      : [];
  } catch {
    return [];
  }
}

function isUneditedGeneratedSeed(variant) {
  const productId = String(variant.productId ?? '');
  const id = String(variant.id ?? '');
  const seedSuffix = id.startsWith(`${productId}-variant-`)
    ? id.slice(`${productId}-variant-`.length)
    : '';
  return Boolean(
    productId &&
    /^\d+$/.test(seedSuffix) &&
    variant.createdAt &&
    variant.createdAt === variant.updatedAt
  );
}

export function getProductVariants(products = []) {
  const productsById = new Map(
    products
      .map((product) => [
        String(product.id ?? product._id ?? product.productId ?? ''),
        product,
      ])
      .filter(([productId]) => productId)
  );
  return readStoredVariants()
    .map((variant) => {
      const productId = String(variant.productId ?? '');
      const product = productsById.get(productId);
      if (!product || !String(variant.id ?? '').trim()) return null;

      const rawColor =
        typeof variant.color === 'string'
          ? { name: variant.color }
          : (variant.color ?? {});
      const colorName = String(rawColor.name ?? '').trim();
      const price = Number(variant.price);
      const salePrice = Number(variant.salePrice);
      const stock = Number(variant.stock);

      return {
        ...variant,
        id: String(variant.id),
        productId,
        productName: product.name ?? variant.productName ?? '',
        sku: String(variant.sku ?? ''),
        color: {
          ...rawColor,
          name: colorName,
          hex: rawColor.hex || getColorHex(colorName),
        },
        size: String(variant.size ?? ''),
        price: Number.isFinite(price) ? price : 0,
        salePrice: Number.isFinite(salePrice) ? salePrice : 0,
        stock: Number.isFinite(stock) ? Math.max(0, stock) : 0,
        image: variant.image || product.images?.[0] || '',
        status: variant.status === 'active' ? 'active' : 'inactive',
      };
    })
    .filter(Boolean);
}

export function saveProductVariants(variants) {
  if (!Array.isArray(variants) || typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(
      PRODUCT_VARIANTS_STORAGE_KEY,
      JSON.stringify(variants)
    );
  } catch {
    return false;
  }
  window.dispatchEvent(
    new CustomEvent(PRODUCT_VARIANTS_EVENT, { detail: variants })
  );
  return true;
}

export function removeProductVariants(productId) {
  const normalizedId = String(productId ?? '');
  const current = readStoredVariants();
  const next = current.filter(
    (variant) => String(variant.productId ?? '') !== normalizedId
  );
  return next.length === current.length || saveProductVariants(next);
}
