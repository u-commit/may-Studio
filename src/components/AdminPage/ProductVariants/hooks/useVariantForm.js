import { useState } from 'react';

function useVariantForm({ products, variants, variant, onSave }) {
  const editing = Boolean(variant);
  const initialProduct =
    products.find(
      (product) => String(product.id) === String(variant?.productId)
    ) ?? products[0];
  const [productId, setProductId] = useState(String(initialProduct?.id ?? ''));
  const [defaultPrice, setDefaultPrice] = useState(
    String(variant?.price ?? initialProduct?.price ?? '')
  );
  const [defaultSalePrice, setDefaultSalePrice] = useState(
    String(variant?.salePrice || '')
  );
  const [defaultStock, setDefaultStock] = useState(String(variant?.stock ?? 0));
  const [rows, setRows] = useState(() =>
    variant
      ? [
          {
            id: variant.id,
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            price: variant.price,
            salePrice: variant.salePrice || '',
            stock: variant.stock,
            image: variant.image || '',
            status: variant.status || 'active',
          },
        ]
      : []
  );
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const selectedProduct = products.find(
    (product) => String(product.id) === productId
  );

  function buildErrors(nextRows = rows, nextProductId = productId) {
    const nextErrors = {};
    if (!nextProductId) nextErrors.productId = 'Vui lòng chọn sản phẩm.';
    if (!nextRows.length)
      nextErrors.combinations = 'Tạo ít nhất một tổ hợp trước khi lưu.';

    const skuRows = new Map();
    const comboRows = new Map();
    nextRows.forEach((row) => {
      const sku = String(row.sku ?? '')
        .trim()
        .toLocaleLowerCase('vi');
      const rowErrors = {};
      if (!sku) rowErrors.sku = 'SKU là bắt buộc.';
      else if (skuRows.has(sku))
        rowErrors.sku = 'SKU đang bị trùng trong danh sách.';
      else if (
        variants.some(
          (item) =>
            item.id !== variant?.id && item.sku?.toLocaleLowerCase('vi') === sku
        )
      )
        rowErrors.sku = 'SKU đã tồn tại.';
      if (sku) skuRows.set(sku, row.id);

      const price = Number(row.price);
      const salePrice =
        row.salePrice === '' || row.salePrice == null
          ? 0
          : Number(row.salePrice);
      const stock = Number(row.stock);
      if (!Number.isFinite(price) || price <= 0)
        rowErrors.price = 'Giá bán phải lớn hơn 0.';
      if (
        row.salePrice !== '' &&
        row.salePrice != null &&
        (!Number.isFinite(salePrice) || salePrice < 0 || salePrice > price)
      )
        rowErrors.salePrice = 'Giá ưu đãi phải từ 0 đến giá bán.';
      if (!Number.isInteger(stock) || stock < 0)
        rowErrors.stock = 'Tồn kho phải là số nguyên không âm.';

      const colorName = row.color?.name?.toLocaleLowerCase('vi');
      const combo = `${nextProductId}|${colorName}|${String(row.size).toLocaleLowerCase('vi')}`;
      if (comboRows.has(combo))
        rowErrors.combination = 'Tổ hợp này đang bị lặp.';
      else if (
        variants.some(
          (item) =>
            item.id !== variant?.id &&
            `${item.productId}|${item.color?.name?.toLocaleLowerCase('vi')}|${String(item.size).toLocaleLowerCase('vi')}` ===
              combo
        )
      )
        rowErrors.combination = 'Sản phẩm đã có tổ hợp màu và size này.';
      comboRows.set(combo, row.id);

      if (Object.keys(rowErrors).length) nextErrors[row.id] = rowErrors;
    });
    return nextErrors;
  }

  function handleRowsChange(nextRows) {
    setRows(nextRows);
    if (attempted) setErrors(buildErrors(nextRows));
  }

  function handleProductChange(event) {
    const nextId = event.target.value;
    setProductId(nextId);
    const product = products.find((item) => String(item.id) === nextId);
    if (!editing && product) setDefaultPrice(String(product.price || ''));
    if (attempted) setErrors(buildErrors(rows, nextId));
  }

  function handleDefaultChange(field, value) {
    if (field === 'price') setDefaultPrice(value);
    if (field === 'salePrice') setDefaultSalePrice(value);
    if (field === 'stock') setDefaultStock(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = buildErrors();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || !selectedProduct) return;
    onSave(rows, selectedProduct);
  }

  return {
    editing,
    productId,
    selectedProduct,
    defaultPrice,
    defaultSalePrice,
    defaultStock,
    rows,
    errors,
    handleRowsChange,
    handleProductChange,
    handleDefaultChange,
    handleSubmit,
  };
}

export default useVariantForm;
