import { useState } from 'react';
import styles from './styles.module.scss';
import reloadIcon from '@icons/svgs/reloadIcon.svg';
import cartIcon from '@icons/svgs/cartIcon.svg';
import heartIcon from '@icons/svgs/heartIcon.svg';
function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${amount.toLocaleString('vi-VN')} ₫` : '—';
}

function normalizeColorHex(value) {
  const color = String(value ?? '').trim();
  if (/^#[\da-f]{3,8}$/i.test(color)) return color;
  if (/^[\da-f]{3,8}$/i.test(color)) return `#${color}`;
  return '#d9dfd8';
}

function ProductItem({ src, PrevSrc, prevSrc, name, price, variants = [] }) {
  const previewSrc = PrevSrc ?? prevSrc;
  const { productCard, boxImg, showImgWhenHover, showFncWhenHover, boxIcon, title, Price } = styles;
  const activeVariants = variants.filter((variant) => variant.status === 'active');
  const firstAvailableVariant =
    activeVariants.find((variant) => Number(variant.stock) > 0) ??
    activeVariants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(
    firstAvailableVariant?.id ?? ''
  );
  const selectedVariant =
    activeVariants.find((variant) => variant.id === selectedVariantId) ??
    firstAvailableVariant;
  const selectedColor = selectedVariant?.color?.name ?? '';
  const colorOptions = [
    ...new Map(
      activeVariants
        .filter((variant) => variant.color?.name)
        .map((variant) => [variant.color.name.toLocaleLowerCase('vi'), variant])
    ).values(),
  ];
  const sizeOptions = activeVariants.filter(
    (variant) => variant.color?.name === selectedColor
  );
  const image = selectedVariant?.image || src;
  const salePrice = Number(selectedVariant?.salePrice) || 0;
  const displayPrice =
    salePrice > 0 ? salePrice : (selectedVariant?.price ?? price);
  const stock = Math.max(0, Number(selectedVariant?.stock) || 0);

  function selectColor(colorName) {
    const candidates = activeVariants.filter(
      (variant) => variant.color?.name === colorName
    );
    const next =
      candidates.find((variant) => variant.size === selectedVariant?.size) ??
      candidates.find((variant) => Number(variant.stock) > 0) ??
      candidates[0];
    if (next) setSelectedVariantId(next.id);
  }

  function selectSize(size) {
    const next = sizeOptions.find((variant) => variant.size === size);
    if (next) setSelectedVariantId(next.id);
  }

  return (
    <article className={productCard}>
      <div className={boxImg}>
        <img src={image} alt={name} />
        {previewSrc && (
          <img src={previewSrc} alt={name} className={showImgWhenHover} />
        )}
        <div className={showFncWhenHover}>
          <div className={boxIcon}>
            <img src={cartIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={heartIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={reloadIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={reloadIcon} alt='' />
          </div>
        </div>
      </div>
      <div className={title}>{name}</div>
      <div className={styles.priceBlock}>
        <span className={Price}>{formatPrice(displayPrice)}</span>
        {salePrice > 0 && (
          <del className={styles.originalPrice}>
            {formatPrice(selectedVariant.price)}
          </del>
        )}
      </div>
      {activeVariants.length > 0 ? (
        <div className={styles.variantOptions}>
          {colorOptions.length > 0 && (
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Màu: {selectedColor}</span>
              <div className={styles.colorOptions}>
                {colorOptions.map((variant) => (
                  <button
                    className={`${styles.colorOption} ${variant.color.name === selectedColor ? styles.optionSelected : ''}`}
                    key={variant.color.name}
                    type='button'
                    aria-label={`Chọn màu ${variant.color.name}`}
                    aria-pressed={variant.color.name === selectedColor}
                    title={variant.color.name}
                    style={{
                      '--swatch-color': normalizeColorHex(variant.color.hex),
                    }}
                    onClick={() => selectColor(variant.color.name)}
                  />
                ))}
              </div>
            </div>
          )}
          {sizeOptions.length > 0 && (
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Kích thước</span>
              <div className={styles.sizeOptions}>
                {sizeOptions.map((variant) => (
                  <button
                    className={`${styles.sizeOption} ${variant.id === selectedVariant?.id ? styles.optionSelected : ''}`}
                    key={variant.id}
                    type='button'
                    aria-pressed={variant.id === selectedVariant?.id}
                    onClick={() => selectSize(variant.size)}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={styles.variantMeta}>
            {selectedVariant?.sku && <span>SKU: {selectedVariant.sku}</span>}
            <span className={stock > 0 ? styles.inStock : styles.outOfStock}>
              {stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>
        </div>
      ) : variants.length > 0 ? (
        <p className={styles.outOfStock}>Sản phẩm tạm ngừng kinh doanh</p>
      ) : null}
    </article>
  );
}

export default ProductItem;
