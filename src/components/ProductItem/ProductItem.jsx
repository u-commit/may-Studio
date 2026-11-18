import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';
const { imageLink, priceBlock, titleLink } = styles;
import { LiaShoppingBagSolid, LiaEyeSolid } from 'react-icons/lia';
import { CiHeart } from 'react-icons/ci';
import { TfiReload } from 'react-icons/tfi';
import { SideBarContext } from '@/contexts/SideBarProvide';
import { addCartItem } from '@/utils/cartStore';
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

function ProductItem({
  src,
  PrevSrc,
  prevSrc,
  name,
  price,
  variants = [],
  details = {},
}) {
  const previewSrc = PrevSrc ?? prevSrc;
  const {
    productCard,
    boxImg,
    showImgWhenHover,
    showFncWhenHover,
    boxIcon,
    title,
    Price,
  } = styles;
  const { setIsOpen, setType } = useContext(SideBarContext);
  const activeVariants = variants.filter(
    (variant) => variant.status === 'active'
  );
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
  const productHref = `/product/${encodeURIComponent(
    details.id ?? details._id ?? details.productId ?? ''
  )}`;
  const salePrice = Number(selectedVariant?.salePrice) || 0;
  const displayPrice =
    salePrice > 0 ? salePrice : (selectedVariant?.price ?? price);
  const stock = Math.max(
    0,
    Number(selectedVariant?.stock ?? details.stock) || 0
  );

  function addToCart() {
    const productId = String(
      details?.id ?? details?._id ?? details?.productId ?? ''
    );
    const saved = addCartItem({
      id: String(selectedVariant?.id ?? productId),
      productId,
      variantId: selectedVariant?.id ?? '',
      name,
      image,
      price: displayPrice,
      color: selectedVariant?.color?.name ?? details.color ?? '',
      size: selectedVariant?.size ?? '',
      sku: selectedVariant?.sku ?? details.sku ?? '',
    });

    if (saved) {
      setType('cart');
      setIsOpen(true);
    }
  }

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
        <Link
          to={productHref}
          className={imageLink}
          aria-label={`Xem chi tiết ${name}`}
        >
          <img src={image} alt={name} />
          {previewSrc && (
            <img src={previewSrc} alt='' className={showImgWhenHover} />
          )}
        </Link>
        <div className={showFncWhenHover}>
          <button
            type='button'
            className={boxIcon}
            onClick={addToCart}
            aria-label='Thêm vào giỏ'
            disabled={stock <= 0}
          >
            <LiaShoppingBagSolid />
          </button>
          <div className={boxIcon}>
            <CiHeart />
          </div>
          <div className={boxIcon}>
            <TfiReload />
          </div>
          <div className={boxIcon}>
            <LiaEyeSolid />
          </div>
        </div>
      </div>
      <div className={title}>
        <Link to={productHref} className={titleLink}>
          {name}
        </Link>
      </div>
      <div className={priceBlock}>
        <span className={Price}>{formatPrice(displayPrice)}</span>
      </div>
    </article>
  );
}

export default ProductItem;
