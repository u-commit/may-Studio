function getLabel(value) {
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (!value || typeof value !== 'object') return '';
  return String(value.name ?? value.title ?? value.label ?? value.value ?? '');
}

function getList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string')
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  return value == null ? [] : [value];
}

function normalizeImages(product) {
  const rawImages =
    product.images ?? product.imageUrls ?? product.imageUrl ?? product.image;
  return getList(rawImages)
    .map((image) =>
      typeof image === 'string'
        ? image
        : (image?.url ?? image?.src ?? image?.imageUrl ?? '')
    )
    .filter(Boolean);
}

export function normalizeProductList(response) {
  const candidates = [
    response?.contents,
    response?.data?.contents,
    response?.data?.products,
    response?.products,
    response?.data,
    response,
  ];
  const list = candidates.find(Array.isArray);
  if (!list) throw new Error('API không trả về danh sách sản phẩm hợp lệ.');

  return list.map((product, index) => ({
    ...product,
    id: String(
      product.id ?? product._id ?? product.productId ?? `api-${index + 1}`
    ),
    name:
      getLabel(product.name ?? product.productName ?? product.title) ||
      `Sản phẩm ${index + 1}`,
    description: String(
      product.description ?? product.information ?? product.details ?? ''
    ),
    images: normalizeImages(product),
    category: getLabel(
      product.category ?? product.categoryName ?? product.type
    ),
    manufacturer: getLabel(
      product.manufacturer ?? product.producer ?? product.brand
    ),
    color: getLabel(product.color ?? product.colour),
    sizes: getList(product.sizes ?? product.size)
      .map(getLabel)
      .filter(Boolean),
    price: Number(product.price ?? product.salePrice ?? 0),
    stock: Number(product.stock ?? product.quantity ?? product.inventory ?? 0),
  }));
}

export function mergeProductCatalog(catalog, products) {
  const merge = (current, incoming) => [
    ...new Set([...current, ...incoming].filter(Boolean)),
  ];
  return {
    ...catalog,
    categories: merge(
      catalog.categories,
      products.map((product) => product.category)
    ),
    manufacturers: merge(
      catalog.manufacturers,
      products.map((product) => product.manufacturer)
    ),
    colors: merge(
      catalog.colors,
      products.map((product) => product.color)
    ),
    sizes: merge(
      catalog.sizes,
      products.flatMap((product) => product.sizes)
    ),
  };
}
