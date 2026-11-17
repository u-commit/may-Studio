const productSamples = [
  { productId: 'MAY001', productName: 'Áo sơ mi nữ thanh lịch' },
  { productId: 'MAY002', productName: 'Quần tây nữ ống đứng' },
  { productId: 'MAY003', productName: 'Áo khoác dạ tối giản' },
  { productId: 'MAY004', productName: 'Chân váy chữ A' },
];

function variant(
  id,
  productIndex,
  color,
  size,
  sku,
  price,
  salePrice,
  stock,
  isActive
) {
  const product = productSamples[productIndex];
  return {
    id,
    productId: product.productId,
    productName: product.productName,
    color: { name: color },
    size,
    sku,
    price,
    salePrice,
    stock,
    isActive,
    status: isActive ? 'active' : 'inactive',
    images: [],
    image: '',
  };
}

export const MOCK_PRODUCT_SAMPLES = productSamples;

export const MOCK_VARIANTS = [
  variant('MAY001-01', 0, 'Trắng', 'S', 'MAY001-W-S', 350000, 320000, 25, true),
  variant('MAY001-02', 0, 'Đen', 'M', 'MAY001-B-M', 350000, 320000, 20, true),
  variant('MAY001-03', 0, 'Be', 'L', 'MAY001-BE-L', 370000, 340000, 15, true),
  variant('MAY001-04', 0, 'Trắng', 'M', 'MAY001-W-M', 350000, 320000, 30, true),
  variant('MAY001-05', 0, 'Be', 'S', 'MAY001-BE-S', 350000, 320000, 18, false),
  variant('MAY001-06', 0, 'Đen', 'S', 'MAY001-B-S', 350000, null, 17, false),
  variant('MAY002-01', 1, 'Đen', 'S', 'MAY002-B-S', 520000, null, 12, true),
  variant('MAY002-02', 1, 'Đen', 'M', 'MAY002-B-M', 520000, null, 8, true),
  variant('MAY002-03', 1, 'Be', 'L', 'MAY002-BE-L', 540000, 510000, 5, true),
  variant('MAY003-01', 2, 'Nâu', 'M', 'MAY003-BR-M', 1250000, null, 0, false),
  variant('MAY003-02', 2, 'Đen', 'L', 'MAY003-B-L', 1250000, null, 0, false),
  variant(
    'MAY004-01',
    3,
    'Xanh sage',
    'S',
    'MAY004-SG-S',
    430000,
    399000,
    9,
    true
  ),
  variant('MAY004-02', 3, 'Đen', 'M', 'MAY004-B-M', 430000, null, 6, true),
];

export function cloneVariants(variants) {
  return variants.map((item) => ({
    ...item,
    color: { ...item.color },
    images: [...(item.images ?? [])],
  }));
}
