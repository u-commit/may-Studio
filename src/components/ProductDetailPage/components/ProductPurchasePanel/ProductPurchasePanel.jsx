import { useState } from 'react';
import Button from '@components/Button/Button';
import { getColorHex } from '@/apis/productVariantsService';
import styles from './styles.module.scss';
const {
  cartActions,
  cartButton,
  container,
  colorOption,
  colorOptions,
  inStock,
  metaList,
  optionGroup,
  outOfStock,
  productName,
  productPrice,
  purchaseDivider,
  purchaseAction,
  quantityControl,
  quantityValue,
  selectedOption,
  sizeOption,
  sizeOptions,
  stockStatus,
  summary,
  variantLabel,
} = styles;

function ProductPurchasePanel({ product, details }) {
  const {
    activeVariants,
    availableColors,
    currentColor,
    sizes,
    selectedVariant,
    chooseColor,
    chooseSize,
    displayPrice,
    manufacturer,
    stock,
    formatPrice,
    addToCart,
  } = details;
  const [quantity, setQuantity] = useState(1);
  const currentSku = selectedVariant?.sku || product.sku;
  const description = product.description?.trim();
  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : (product.category?.name ?? '');
  const prices = activeVariants
    .map((variant) =>
      Number(variant.salePrice) > 0
        ? Number(variant.salePrice)
        : Number(variant.price) || 0
    )
    .filter((value) => value > 0);
  const lowestPrice = prices.length
    ? Math.min(...prices)
    : Number(displayPrice) || 0;
  const highestPrice = prices.length ? Math.max(...prices) : lowestPrice;
  const priceText =
    lowestPrice !== highestPrice
      ? `${formatPrice(lowestPrice)} – ${formatPrice(highestPrice)}`
      : formatPrice(displayPrice);
  const requiresVariant = activeVariants.length > 0;
  const canAddToCart =
    stock > 0 && (!requiresVariant || Boolean(selectedVariant));

  function addSelectedQuantity() {
    if (canAddToCart) addToCart(Math.min(quantity, stock));
  }

  return (
    <section className={container}>
      <h1 className={productName}>{product.name}</h1>
      <p className={productPrice}>{priceText}</p>
      <div className={summary}>
        {description ? (
          <p>{description}</p>
        ) : (
          <p>
            Thiết kế chỉn chu, dễ kết hợp trong nhiều dịp. Chất liệu và phom
            dáng được chọn để mang lại cảm giác thoải mái khi sử dụng hằng ngày.
          </p>
        )}
      </div>

      {availableColors.length > 0 && (
        <div className={optionGroup}>
          <span className={variantLabel}>
            Màu sắc: {currentColor || 'Chưa chọn'}
          </span>
          <div className={colorOptions} aria-label='Chọn màu sắc'>
            {availableColors.map((variant) => {
              const colorName = variant.color.name;
              return (
                <button
                  key={colorName}
                  type='button'
                  className={`${colorOption} ${currentColor === colorName ? selectedOption : ''}`}
                  style={{
                    '--product-color':
                      variant.color.hex || getColorHex(colorName),
                  }}
                  onClick={() => chooseColor(colorName)}
                  aria-label={colorName}
                  aria-pressed={currentColor === colorName}
                  title={colorName}
                />
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className={optionGroup}>
          <div className={variantLabel}>
            <span>
              Kích cỡ{selectedVariant?.size ? `: ${selectedVariant.size}` : ''}
            </span>
          </div>
          <div className={sizeOptions} aria-label='Chọn kích cỡ'>
            {sizes.map((size) => (
              <button
                key={size}
                type='button'
                className={`${sizeOption} ${selectedVariant?.size === size ? selectedOption : ''}`}
                onClick={() => chooseSize(size)}
                aria-pressed={selectedVariant?.size === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={`${stockStatus} ${canAddToCart ? inStock : outOfStock}`}>
        {!selectedVariant && requiresVariant
          ? 'Vui lòng chọn màu sắc hoặc kích cỡ'
          : stock > 0
            ? `Còn ${stock} sản phẩm`
            : 'Sản phẩm hiện đã hết hàng'}
      </p>
      <p className={productPrice}>{formatPrice(displayPrice)}</p>

      <div className={cartActions}>
        <div className={quantityControl} aria-label='Số lượng sản phẩm'>
          <button
            type='button'
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label='Giảm số lượng'
            disabled={quantity <= 1 || !canAddToCart}
          >
            −
          </button>
          <span className={quantityValue}>{quantity}</span>
          <button
            type='button'
            onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
            aria-label='Tăng số lượng'
            disabled={quantity >= stock || !canAddToCart}
          >
            +
          </button>
        </div>
        <Button
          content='Thêm vào giỏ hàng'
          variant='primary'
          className={cartButton}
          onClick={addSelectedQuantity}
          disabled={!canAddToCart}
        />
      </div>
      <div className={purchaseDivider}>
        <span>HOẶC</span>
      </div>
      <Button
        content='Thanh toán ngay'
        variant='primary'
        className={purchaseAction}
        onClick={addSelectedQuantity}
        disabled={!canAddToCart}
      />
    </section>
  );
}

export default ProductPurchasePanel;
