import { useContext, useState } from 'react';
import { getColorHex } from '@/apis/productVariantsService';
import { SideBarContext } from '@/contexts/SideBarProvide';
import { addCartItem } from '@/utils/cartStore';
import {
  formatShopPrice,
  getActiveShopVariants,
  getShopCategoryName,
  getShopProductId,
} from './shopHelpers';

export default function useShopProductCard(product, variants = []) {
  const { setIsOpen, setType } = useContext(SideBarContext);
  const activeVariants = getActiveShopVariants(variants);
  const initialVariant =
    activeVariants.find((variant) => Number(variant.stock) > 0) ??
    activeVariants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(
    initialVariant?.id ?? ''
  );
  const selectedVariant =
    activeVariants.find((variant) => variant.id === selectedVariantId) ??
    initialVariant;
  const availableColors = [
    ...new Map(
      activeVariants
        .filter((variant) => variant.color?.name)
        .map((variant) => [variant.color.name.toLocaleLowerCase('vi'), variant])
    ).values(),
  ];
  const currentColor = selectedVariant?.color?.name ?? '';
  const availableSizes = currentColor
    ? activeVariants.filter((variant) => variant.color?.name === currentColor)
    : activeVariants;
  const sizes = activeVariants.length
    ? [...new Set(availableSizes.map((variant) => variant.size).filter(Boolean))]
    : product.sizes ?? [];
  const image = selectedVariant?.image || product.images?.[0] || '';
  const salePrice = Number(selectedVariant?.salePrice) || 0;
  const regularPrice = Number(selectedVariant?.price ?? product.price) || 0;
  const displayPrice = salePrice > 0 ? salePrice : regularPrice;
  const manufacturer = product.manufacturer || getShopCategoryName(product);
  const stock = Number(selectedVariant?.stock ?? product.stock) || 0;

  function chooseColor(colorName) {
    const options = activeVariants.filter(
      (variant) => variant.color?.name === colorName
    );
    const next =
      options.find((variant) => variant.size === selectedVariant?.size) ??
      options.find((variant) => Number(variant.stock) > 0) ??
      options[0];
    if (next) setSelectedVariantId(next.id);
  }

  function chooseSize(size) {
    const next = availableSizes.find((variant) => variant.size === size);
    if (next) setSelectedVariantId(next.id);
  }

  function addToCart() {
    const saved = addCartItem({
      id: String(selectedVariant?.id ?? product.id),
      productId: getShopProductId(product),
      variantId: selectedVariant?.id ?? '',
      name: product.name,
      image,
      price: displayPrice,
      color: selectedVariant?.color?.name ?? product.color ?? '',
      size: selectedVariant?.size ?? '',
      sku: selectedVariant?.sku ?? product.sku ?? '',
    });
    if (saved) {
      setType('cart');
      setIsOpen(true);
    }
  }

  return {
    activeVariants,
    availableColors,
    currentColor,
    sizes,
    selectedVariant,
    image,
    salePrice,
    regularPrice,
    displayPrice,
    manufacturer,
    stock,
    formatPrice: formatShopPrice,
    chooseColor,
    chooseSize,
    addToCart,
  };
}
