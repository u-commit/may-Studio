import { useEffect, useMemo, useState } from 'react';
import { getProduct } from '@/apis/productsService';
import { normalizeProductList } from '@components/AdminPage/productAdapter';
import useStorefrontVariants from '@components/ProductItem/useStorefrontVariants';
import {
  applyProductChanges,
  PRODUCT_CHANGES_EVENT,
  PRODUCT_CHANGES_STORAGE_KEY,
} from '@/utils/productStore';
import {
  getShopCategoryName,
  getShopProductId,
  getShopStartingPrice,
} from './shopHelpers';

export default function useShopPage() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [layout, setLayout] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const variantsByProductId = useStorefrontVariants(products);

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
        if (isMounted) {
          setProducts(applyProductChanges(normalizeProductList(response)));
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(
            'Không tải được danh sách sản phẩm. Vui lòng thử lại sau.'
          );
        }
      });

    return () => {
      isMounted = false;
      window.removeEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map(getShopCategoryName).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi');
    const filtered = products.filter((product) => {
      const searchText = [
        product.name,
        product.description,
        getShopCategoryName(product),
        product.manufacturer,
      ]
        .join(' ')
        .toLocaleLowerCase('vi');
      return (
        searchText.includes(normalizedSearch) &&
        (category === 'all' || getShopCategoryName(product) === category)
      );
    });

    const sorted = [...filtered];
    if (sortBy === 'price-asc') {
      sorted.sort(
        (a, b) =>
          getShopStartingPrice(a, variantsByProductId.get(getShopProductId(a))) -
          getShopStartingPrice(b, variantsByProductId.get(getShopProductId(b)))
      );
    } else if (sortBy === 'price-desc') {
      sorted.sort(
        (a, b) =>
          getShopStartingPrice(b, variantsByProductId.get(getShopProductId(b))) -
          getShopStartingPrice(a, variantsByProductId.get(getShopProductId(a)))
      );
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return sorted;
  }, [products, search, category, sortBy, variantsByProductId]);

  function onHeaderSearch(query, selectedCategory) {
    setSearch(query);
    setCategory(selectedCategory);
    document
      .getElementById('shop-products')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  function loadMoreProducts() {
    setItemsPerPage((current) => current + 8);
  }

  return {
    products,
    categories,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    layout,
    setLayout,
    itemsPerPage,
    setItemsPerPage,
    loadMoreProducts,
    hasMoreProducts: visibleProducts.length > itemsPerPage,
    variantsByProductId,
    visibleProducts,
    loadError,
    onHeaderSearch,
  };
}
