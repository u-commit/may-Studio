import { useMemo, useState } from 'react';
import {
  getProductVariants,
  saveProductVariants,
} from '../../../../apis/productVariantsService';

function useProductVariants(products, enabled) {
  const [savedState, setSavedState] = useState(null);
  const productSignature = products
    .map(
      (product) => `${product.id}:${product.name}:${product.images?.[0] ?? ''}`
    )
    .join('|');
  const variants = useMemo(() => {
    if (!enabled) return [];
    return savedState?.productSignature === productSignature
      ? savedState.variants
      : getProductVariants(products);
  }, [enabled, productSignature, products, savedState]);

  function updateVariants(next) {
    setSavedState({ productSignature, variants: next });
    saveProductVariants(next);
  }

  return { variants, ready: enabled, updateVariants };
}

export default useProductVariants;
