export function getShopCategoryName(product) {
  const category = product.category ?? product.categoryName ?? product.type;
  if (typeof category === 'string') return category;
  return category?.name ?? category?.title ?? '';
}

export function getShopProductId(product) {
  return String(product?.id ?? product?._id ?? product?.productId ?? '');
}

export function getActiveShopVariants(variants = []) {
  return variants.filter((variant) => variant.status === 'active');
}

export function formatShopPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${amount.toLocaleString('vi-VN')} ₫` : '—';
}

export function getShopStartingPrice(product, variants) {
  const activeVariants = getActiveShopVariants(variants);
  if (!activeVariants.length) return Number(product.price) || 0;
  return Math.min(
    ...activeVariants.map((variant) =>
      Number(variant.salePrice) > 0
        ? Number(variant.salePrice)
        : Number(variant.price) || 0
    )
  );
}
