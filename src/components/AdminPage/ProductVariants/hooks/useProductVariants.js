import { useEffect, useMemo, useState } from 'react';
import {
  getProductVariants,
  PRODUCT_VARIANTS_EVENT,
  PRODUCT_VARIANTS_STORAGE_KEY,
  saveProductVariants,
} from '../../../../apis/productVariantsService';

function useProductVariants(products, enabled) {
  const [savedState, setSavedState] = useState(null);
  const [storageRevision, setStorageRevision] = useState(0);
  const productSignature = JSON.stringify(
    products.map((product) => [
      product.id ?? product._id ?? product.productId,
      product.name,
      product.images?.[0] ?? '',
    ])
  );

  useEffect(() => {
    const refreshFromStorage = () => {
      setSavedState(null);
      setStorageRevision((revision) => revision + 1);
    };
    const handleVariantChange = refreshFromStorage;
    const handleStorage = (event) => {
      if (event.key === PRODUCT_VARIANTS_STORAGE_KEY || event.key === null) {
        refreshFromStorage();
      }
    };
    window.addEventListener(PRODUCT_VARIANTS_EVENT, handleVariantChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(PRODUCT_VARIANTS_EVENT, handleVariantChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const variants = useMemo(() => {
    if (!enabled) return [];
    return savedState?.productSignature === productSignature &&
      savedState.storageRevision === storageRevision
      ? savedState.variants
      : getProductVariants(products);
  }, [enabled, productSignature, products, savedState, storageRevision]);

  function updateVariants(next) {
    if (!saveProductVariants(next)) return false;
    setSavedState({
      productSignature,
      storageRevision: storageRevision + 1,
      variants: next,
    });
    return true;
  }

  return { variants, ready: enabled, updateVariants };
}

export default useProductVariants;
