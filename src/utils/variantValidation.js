const normalize = (value) =>
  String(value ?? '')
    .trim()
    .toLocaleLowerCase('vi');

export function validateVariants(variants, existingVariants = [], productId) {
  const errors = {};
  const skuOwners = new Map();
  const combinationOwners = new Map();

  variants.forEach((variant, index) => {
    const rowErrors = {};
    const sku = normalize(variant.sku);
    const color = normalize(variant.color?.name ?? variant.color);
    const size = normalize(variant.size);
    const price = Number(variant.price);
    const salePrice =
      variant.salePrice === '' || variant.salePrice == null
        ? null
        : Number(variant.salePrice);
    const stockInput = String(variant.stock ?? '').trim();
    const stock = Number(variant.stock);

    if (!sku) rowErrors.sku = 'SKU là bắt buộc.';
    else if (skuOwners.has(sku)) rowErrors.sku = 'SKU đang bị trùng.';
    else if (
      existingVariants.some(
        (item) => item.id !== variant.id && normalize(item.sku) === sku
      )
    ) {
      rowErrors.sku = 'SKU đã tồn tại.';
    }
    skuOwners.set(sku, index);

    if (!color) rowErrors.color = 'Màu sắc là bắt buộc.';
    if (!size) rowErrors.size = 'Kích thước là bắt buộc.';
    const combination = `${color}\u0000${size}`;
    if (combinationOwners.has(combination))
      rowErrors.combination = 'Màu sắc và kích thước đang bị trùng.';
    else if (
      existingVariants.some(
        (item) =>
          item.id !== variant.id &&
          (productId == null || String(item.productId) === String(productId)) &&
          normalize(item.color?.name ?? item.color) === color &&
          normalize(item.size) === size
      )
    ) {
      rowErrors.combination = 'Sản phẩm đã có tổ hợp màu và kích thước này.';
    }
    combinationOwners.set(combination, index);

    if (!Number.isInteger(price) || price <= 0)
      rowErrors.price = 'Giá bán phải là số nguyên lớn hơn 0.';
    if (
      salePrice !== null &&
      (!Number.isInteger(salePrice) || salePrice < 0 || salePrice >= price)
    ) {
      rowErrors.salePrice = 'Giá khuyến mãi phải nhỏ hơn giá bán.';
    }
    if (!stockInput || !Number.isInteger(stock) || stock < 0)
      rowErrors.stock = 'Tồn kho phải là số nguyên không âm.';
    if (Object.keys(rowErrors).length)
      errors[variant.id ?? `new-${index}`] = rowErrors;
  });

  return errors;
}

export function hasVariantErrors(errors) {
  return Object.keys(errors).length > 0;
}
