export function getVariantSummary(variants = []) {
  const colors = [
    ...new Set(
      variants
        .map((item) => String(item.color?.name ?? item.color ?? '').trim())
        .filter(Boolean)
    ),
  ];
  const sizes = [
    ...new Set(
      variants.map((item) => String(item.size ?? '').trim()).filter(Boolean)
    ),
  ];
  const stock = variants.reduce(
    (total, item) => total + Math.max(0, Number(item.stock) || 0),
    0
  );
  const activeCount = variants.filter(
    (item) => item.isActive ?? item.status === 'active'
  ).length;

  return {
    count: variants.length,
    stock,
    activeCount,
    status: stock > 0 ? 'Còn hàng' : 'Hết hàng',
    colorSize: `${colors.join(', ') || '—'} · ${sizes.join(', ') || '—'}`,
  };
}
