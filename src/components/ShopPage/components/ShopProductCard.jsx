import Button from '@components/Button/Button';
import { Link } from 'react-router-dom';
import { LiaShoppingBagSolid, LiaEyeSolid } from 'react-icons/lia';
import { CiHeart } from 'react-icons/ci';
import { TfiReload } from 'react-icons/tfi';
import useShopProductCard from '../hooks/useShopProductCard';
import styles from './styles.module.scss';
const {
  addToCartButton,
  imageActions,
  imagePlaceholder,
  listCard,
  manufacturer: manufacturerClass,
  module,
  price,
  priceLine,
  productCard,
  productImage,
  productImageLink,
  productInfo,
  productName,
  productNameLink,
  selectedSize,
  sizeChip,
  sizeOptions,
} = styles;
function ShopProductCard({ product, variants, listView }) {
  const {
    image,
    displayPrice,
    manufacturer,
    stock,
    sizes,
    selectedVariant,
    chooseSize,
    formatPrice,
    addToCart,
  } = useShopProductCard(product, variants);

  return (
    <article className={`${productCard} ${listView ? listCard : ''}`}>
      <div className={productImage}>
        <Link
          to={`/product/${encodeURIComponent(product.id)}`}
          className={productImageLink}
          aria-label={`Xem chi tiết ${product.name}`}
        >
          {image ? (
            <img src={image} alt={product.name} loading='lazy' />
          ) : (
            <span className={imagePlaceholder}>MÂY STUDIO</span>
          )}
        </Link>
        <div className={imageActions} aria-label='Thao tác sản phẩm'>
          <button
            type='button'
            onClick={addToCart}
            aria-label='Thêm vào giỏ'
            disabled={stock <= 0}
          >
            <LiaShoppingBagSolid />
          </button>
          <button type='button' aria-label='Yêu thích'>
            <CiHeart />
          </button>
          <button type='button' aria-label='So sánh'>
            <TfiReload />
          </button>
          <button type='button' aria-label='Xem nhanh'>
            <LiaEyeSolid />
          </button>
        </div>
      </div>
      <div className={productInfo}>
        {sizes.length > 0 && (
          <div className={sizeOptions} aria-label='Kích cỡ'>
            {sizes.map((size) => (
              <button
                key={size}
                type='button'
                className={`${sizeChip} ${selectedVariant?.size === size ? selectedSize : ''}`}
                aria-pressed={selectedVariant?.size === size}
                onClick={() => chooseSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        <h2 className={productName}>
          <Link
            to={`/product/${encodeURIComponent(product.id)}`}
            className={productNameLink}
          >
            {product.name}
          </Link>
        </h2>
        {manufacturer && <p className={manufacturerClass}>{manufacturer}</p>}
        <div className={priceLine}>
          <span className={price}>{formatPrice(displayPrice)}</span>
        </div>
        <Button
          content={stock <= 0 ? 'Hết Hàng' : 'Thêm Giỏ Hàng'}
          variant='primary'
          className={addToCartButton}
          onClick={addToCart}
          disabled={stock <= 0}
        />
      </div>
    </article>
  );
}

export default ShopProductCard;
