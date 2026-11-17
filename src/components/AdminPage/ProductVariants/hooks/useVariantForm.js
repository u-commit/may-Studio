import { useState } from 'react';

function normalizeText(value) {
  return String(value ?? '').trim().toLocaleLowerCase('vi');
}

function getCombinationKey(productId, colorName, size) {
  return JSON.stringify([
    String(productId ?? ''),
    normalizeText(colorName),
    normalizeText(size),
  ]);
}

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
    String(variant?.salePrice ?? initialProduct?.salePrice ?? '')
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
    else if (
      !products.some((product) => String(product.id) === String(nextProductId))
    )
      nextErrors.productId = 'Sản phẩm này không còn tồn tại.';
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
            item.id !== variant?.id && normalizeText(item.sku) === sku
        )
      )
        rowErrors.sku = 'SKU đã tồn tại.';
      if (sku) skuRows.set(sku, row.id);

      const priceInput = String(row.price ?? '').trim();
      const price = Number(row.price);
      const hasSalePrice =
        row.salePrice !== '' && row.salePrice != null;
      const salePrice =
        hasSalePrice ? Number(row.salePrice) : 0;
      const stockInput = String(row.stock ?? '').trim();
      const stock = Number(row.stock);
      if (!priceInput || !Number.isFinite(price) || price <= 0)
        rowErrors.price = 'Giá bán phải lớn hơn 0.';
      if (
        hasSalePrice &&
        (!Number.isFinite(salePrice) || salePrice < 0 || salePrice > price)
      )
        rowErrors.salePrice = 'Giá ưu đãi phải từ 0 đến giá bán.';
      if (!stockInput || !Number.isInteger(stock) || stock < 0)
        rowErrors.stock = 'Tồn kho phải là số nguyên không âm.';

      const colorName = normalizeText(row.color?.name);
      const size = normalizeText(row.size);
      if (!colorName) rowErrors.color = 'Màu sắc là bắt buộc.';
      if (!size) rowErrors.size = 'Kích thước là bắt buộc.';
      if (!['active', 'inactive'].includes(row.status))
        rowErrors.status = 'Trạng thái không hợp lệ.';
      const combo = getCombinationKey(nextProductId, colorName, size);
      if (comboRows.has(combo))
        rowErrors.combination = 'Tổ hợp này đang bị lặp.';
      else if (
        variants.some(
          (item) =>
            item.id !== variant?.id &&
            getCombinationKey(
              item.productId,
              item.color?.name,
              item.size
            ) === combo
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
    if (!editing && product) {
      setDefaultPrice(String(product.price ?? ''));
      setDefaultSalePrice(String(product.salePrice ?? ''));
      setDefaultStock('0');
    }
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
