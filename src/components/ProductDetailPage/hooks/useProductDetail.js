import { useEffect, useState } from 'react';
import { getProduct } from '@/apis/productsService';
import { normalizeProductList } from '@components/AdminPage/productAdapter';
import {
  applyProductChanges,
  PRODUCT_CHANGES_EVENT,
  PRODUCT_CHANGES_STORAGE_KEY,
} from '@/utils/productStore';
import { getShopProductId } from '@components/ShopPage/hooks/shopHelpers';

export default function useProductDetail(productId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const syncProductChanges = () => {
      setProducts((current) => applyProductChanges(current));
    };
    const handleStorage = (event) => {
      if (event.key === PRODUCT_CHANGES_STORAGE_KEY || event.key === null) {
        syncProductChanges();
      }
    };

    window.addEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
    window.addEventListener('storage', handleStorage);
    getProduct({ sortType: 0 })
      .then((response) => {
        if (isMounted) setProducts(applyProductChanges(normalizeProductList(response)));
      })
      .catch(() => {
        if (isMounted) setError('Không tải được thông tin sản phẩm. Vui lòng thử lại sau.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      window.removeEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const product = products.find(
    (item) => getShopProductId(item) === String(productId)
  );

  return { product, products, loading, error };
}
