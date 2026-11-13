export function getVariantStatus(variant) {
  if (variant.status !== 'active') return 'inactive';
  const stock = Math.max(0, Number(variant.stock) || 0);
  if (stock === 0) return 'out';
  if (stock <= 5) return 'low';
  return 'active';
}

export const VARIANT_STATUS_LABELS = {
  active: 'Đang hoạt động',
  inactive: 'Ngừng hoạt động',
  out: 'Hết hàng',
  low: 'Sắp hết hàng',
};
