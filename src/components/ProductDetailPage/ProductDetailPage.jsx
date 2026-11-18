import { Link, useParams } from 'react-router-dom';
import MyFooter from '@components/Footer/Footer';
import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import useShopProductCard from '@components/ShopPage/hooks/useShopProductCard';
import useStorefrontVariants from '@components/ProductItem/useStorefrontVariants';
import useProductDetail from './hooks/useProductDetail';
import ProductGallery from './components/ProductGallery/ProductGallery';
import ProductPurchasePanel from './components/ProductPurchasePanel/ProductPurchasePanel';
import ProductReviews from './components/ProductReviews/ProductReviews';
import RelatedProducts from './components/RelatedProducts/RelatedProducts';
import styles from './styles.module.scss';
const {
  breadcrumb,
  container,
  detailLayout,
  information,
  informationItem,
  valueList,
} = styles;

function getAttributeItems(product, variants, productColors, productSizes, category) {
  const rawAttributes =
    product.additionalInformation ??
    product.additionalInfo ??
    product.specifications ??
    product.attributes ??
    [];
  const customItems = Array.isArray(rawAttributes)
    ? rawAttributes
        .map((attribute) => {
          if (typeof attribute === 'string' || typeof attribute === 'number') {
            return String(attribute).trim();
          }
          const label = String(attribute?.name ?? attribute?.label ?? attribute?.key ?? '').trim();
          const value = attribute?.value ?? attribute?.option ?? attribute?.options;
          const valueText = Array.isArray(value) ? value.join(', ') : String(value ?? '').trim();
          return label && valueText ? `${label}: ${valueText}` : valueText || label;
        })
        .filter(Boolean)
    : rawAttributes && typeof rawAttributes === 'object'
      ? Object.entries(rawAttributes)
          .map(([label, value]) => {
            const valueText = Array.isArray(value) ? value.join(', ') : String(value ?? '').trim();
            return valueText ? `${label}: ${valueText}` : '';
          })
          .filter(Boolean)
      : [];
  const builtInItems = [
    ['Phom dáng', product.fit ?? product.fitType ?? product.shape],
    ['Kiểu cổ', product.collar ?? product.collarType ?? product.neckline],
    ['Chất liệu chính', product.mainMaterial ?? product.material],
    ['Loại vải', product.fabricType ?? product.fabric],
    ['Logo', product.logo],
    ['Thương hiệu', product.manufacturer],
    ['Màu sản phẩm', productColors.join(', ') || product.color],
    ['Mã sản phẩm', product.sku || variants.find((variant) => variant.sku)?.sku],
    ['Danh mục', category],
    ['Kích cỡ', productSizes.join(', ') || product.sizes?.join(', ')],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  return [...customItems, ...builtInItems];
}

function ProductDetailContent({
  product,
  variants,
  products,
  variantsByProductId,
}) {
  const productDetails = useShopProductCard(product, variants);
  const images = [
    ...new Set([
      productDetails.image,
      ...variants.map((variant) => variant.image),
      ...(product.images ?? []),
    ].filter(Boolean)),
  ];
  const productColors = [
    ...new Set(variants.map((variant) => variant.color?.name).filter(Boolean)),
  ];
  const productSizes = [
    ...new Set(variants.map((variant) => variant.size).filter(Boolean)),
  ];
  const category =
    typeof product.category === 'string'
      ? product.category
      : product.category?.name ?? '';
  const additionalAttributes = getAttributeItems(
    product,
    variants,
    productColors,
    productSizes,
    category
  );

  return (
    <>
      <nav className={breadcrumb} aria-label='Đường dẫn'>
        <Link to='/'>Trang chủ</Link>
        <span>›</span>
        <Link to='/shop'>Cửa hàng</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className={detailLayout}>
        <ProductGallery
          images={images}
          name={product.name}
          featuredImage={productDetails.image}
        />
        <ProductPurchasePanel product={product} details={productDetails} />
      </div>

      <section className={information}>
        <details className={informationItem}>
          <summary>Thông tin bổ sung</summary>
          <ul className={valueList}>
            {additionalAttributes.map((attribute, index) => (
              <li key={`${attribute}-${index}`}>{attribute}</li>
            ))}
            {additionalAttributes.length === 0 && (
              <li>Thông tin chi tiết đang được cập nhật.</li>
            )}
          </ul>
        </details>
        <details className={informationItem} open>
          <summary>Đánh giá sản phẩm</summary>
          <ProductReviews
            key={product.id}
            productId={product.id}
            productName={product.name}
          />
        </details>
      </section>
      <RelatedProducts
        product={product}
        products={products}
        variantsByProductId={variantsByProductId}
      />
    </>
  );
}

function ProductDetailPage() {
  const { productId } = useParams();
  const { product, products, loading, error } = useProductDetail(productId);
  const variantsByProductId = useStorefrontVariants(products);
  const variants = product
    ? variantsByProductId.get(String(product.id)) ?? []
    : [];

  return (
    <>
      <MyHeader products={products} transparent={false} />
      <MainLayout>
        <div className={container}>
          {loading ? (
            <p>Đang tải thông tin sản phẩm...</p>
          ) : error ? (
            <p role='alert'>{error}</p>
          ) : product ? (
            <ProductDetailContent
              product={product}
              variants={variants}
              products={products}
              variantsByProductId={variantsByProductId}
            />
          ) : (
            <p role='status'>Không tìm thấy sản phẩm này.</p>
          )}
        </div>
      </MainLayout>
      <MyFooter />
    </>
  );
}

export default ProductDetailPage;
