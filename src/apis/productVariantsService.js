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
  return globalThis?.crypto?.randomUUID?.() ?? String(Date.now());
}
function makeSeedVariants(products) {
  const variants = [];
  const createdAt = new Date().toISOString();

  products.forEach((product) => {
    const productId = String(product.id ?? product._id ?? product.productId ?? '');
    const sizes = product.sizes?.length ? product.sizes : ['Freesize'];
    const colorName = product.color || 'Mặc định';
    const totalStock = Math.max(0, Math.floor(Number(product.stock) || 0));
    const baseStock = Math.floor(totalStock / sizes.length);
    let remainder = totalStock % sizes.length;

    sizes.forEach((size, index) => {
      variants.push({
        id: `${productId}-variant-${index + 1}`,
        productId,
        productName: product.name,
        sku: createVariantSKU(product, colorName, size),
        color: { name: colorName, hex: getColorHex(colorName) },
        size,
        price: Number(product.price) || 0,
        salePrice: Number(product.salePrice) || 0,
        stock: baseStock + (remainder-- > 0 ? 1 : 0),
        image: product.images?.[0] ?? '',
        status: 'active',
        createdAt,
        updatedAt: createdAt,
      });
    });
  });

  return variants;
}
export function getProductVariants(products = []) {
  let stored;
  try {
    stored = window.localStorage.getItem(PRODUCT_VARIANTS_STORAGE_KEY);
  } catch {
    return makeSeedVariants(products);
  }

  let variants;
  if (stored === null) {
    variants = makeSeedVariants(products);
  } else {
    try {
      const parsed = JSON.parse(stored);
      variants = Array.isArray(parsed) ? parsed : makeSeedVariants(products);
    } catch {
      variants = makeSeedVariants(products);
    }
  }

  const productsById = new Map(
    products.map((product) => [
      String(product.id ?? product._id ?? product.productId ?? ''),
      product,
    ])
  );
  return variants.map((variant) => {
    const product = productsById.get(String(variant.productId));
    return product
      ? {
          ...variant,
          productName: product.name,
          image: variant.image || product.images?.[0] || '',
        }
      : variant;
  });
}

export function saveProductVariants(variants) {
  try {
    window.localStorage.setItem(
      PRODUCT_VARIANTS_STORAGE_KEY,
      JSON.stringify(variants)
    );
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(PRODUCT_VARIANTS_EVENT, { detail: variants })
    );
  }
}
