import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVariantsForProducts } from '../../../../apis/variantService';
import { PRODUCT_VARIANTS_EVENT } from '../../../../apis/productVariantsService';
import { getVariantSummary } from '../../../../utils/variantSummary';

function useVariantCatalog(products, productsLoading) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => {
    setLoading(true);
    setError('');
    setRevision((current) => current + 1);
  }, []);

  useEffect(() => {
    if (productsLoading) return undefined;
    let active = true;
    getVariantsForProducts(products)
      .then((items) => {
        if (active) setVariants(items);
      })
      .catch((reason) => {
        if (active) setError(reason.message || 'Không tải được biến thể.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [products, productsLoading, revision]);

  useEffect(() => {
    const refresh = retry;
    window.addEventListener(PRODUCT_VARIANTS_EVENT, refresh);
    window.addEventListener('may-studio:variant-service-updated', refresh);
    return () => {
      window.removeEventListener(PRODUCT_VARIANTS_EVENT, refresh);
      window.removeEventListener('may-studio:variant-service-updated', refresh);
    };
  }, [retry]);
  const summaries = useMemo(() => {
    const grouped = new Map();
    variants.forEach((variant) => {
      const id = String(variant.productId);
      grouped.set(id, [...(grouped.get(id) ?? []), variant]);
    });
    return new Map(
      [...grouped].map(([id, items]) => [id, getVariantSummary(items)])
    );
  }, [variants]);

  return { variants, summaries, loading, error, retry };
}

export default useVariantCatalog;
