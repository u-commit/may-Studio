import { useEffect, useMemo, useState } from 'react';
import {
  getProductVariants,
  PRODUCT_VARIANTS_EVENT,
  PRODUCT_VARIANTS_STORAGE_KEY,
} from '@/apis/productVariantsService';

function getProductId(product) {
  return String(product?.id ?? product?._id ?? product?.productId ?? '');
}

function useStorefrontVariants(products) {
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const productsById = new Map(
      products.map((product) => [getProductId(product), product])
    );
    const enrichVariants = (items) =>
      items.map((variant) => {
        const product = productsById.get(String(variant.productId));
        return product
          ? {
              ...variant,
              productName: product.name,
              image: variant.image || product.images?.[0] || '',
            }
          : variant;
      });
    const refresh = () => setVariants(getProductVariants(products));
    const handleVariantChange = (event) => {
      if (Array.isArray(event.detail)) {
        setVariants(enrichVariants(event.detail));
      } else {
        refresh();
      }
    };
    const handleStorage = (event) => {
      if (event.key === PRODUCT_VARIANTS_STORAGE_KEY || event.key === null) {
        refresh();
      }
    };

    refresh();
    window.addEventListener(PRODUCT_VARIANTS_EVENT, handleVariantChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(PRODUCT_VARIANTS_EVENT, handleVariantChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [products]);

  return useMemo(() => {
    const grouped = new Map();
    variants.forEach((variant) => {
      const productId = String(variant.productId);
      const items = grouped.get(productId) ?? [];
      items.push(variant);
      grouped.set(productId, items);
    });
    return grouped;
  }, [variants]);
}

export default useStorefrontVariants;
