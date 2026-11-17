import Button from '@components/Button/Button';
import { LiaShoppingBagSolid, LiaEyeSolid } from 'react-icons/lia';
import { CiHeart } from 'react-icons/ci';
import { TfiReload } from 'react-icons/tfi';
import useShopProductCard from '../hooks/useShopProductCard';
import styles from '../styles.module.scss';
const { addToCartButton, imageActions, imagePlaceholder, listCard, manufacturer, module, price, priceLine, productCard, productImage, productInfo, productName, selectedSize, sizeChip, sizeOptions } = styles;

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
    <article
      className={`${productCard} ${listView ? listCard : ''}`}
    >
      <div className={productImage}>
        {image ? (
          <img src={image} alt={product.name} loading='lazy' />
        ) : (
          <span className={imagePlaceholder}>MÂY STUDIO</span>
        )}
        <div className={imageActions} aria-label='Thao tác sản phẩm'>
          <button type='button' onClick={addToCart} aria-label='Thêm vào giỏ'><LiaShoppingBagSolid /></button>
          <button type='button' aria-label='Yêu thích'><CiHeart /></button>
          <button type='button' aria-label='So sánh'><TfiReload /></button>
          <button type='button' aria-label='Xem nhanh'><LiaEyeSolid /></button>
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
        <h2 className={productName}>{product.name}</h2>
        {manufacturer && <p className={manufacturer}>{manufacturer}</p>}
        <div className={priceLine}>
          <span className={price}>{formatPrice(displayPrice)}</span>
        </div>
        <Button
          content={stock <= 0 ? 'HẾT HÀNG' : 'ADD TO CART'}
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
