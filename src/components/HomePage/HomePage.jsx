import Banner from '@components/Banner/Banner';
import MyHeader from '@components/Header/Header';
import SalesHomePage from '@components/SalesHomePage/salesHomePage.jsx';
import AdvanceHeading from '@components/AdvanceHeading/AdvanceHeading';
import Info from '@components/Info/Info';
import HeadingListProduct from '../HeadingListProduct/HeadingListProduct';
import { useEffect, useMemo, useState } from 'react';
import { getProduct } from '@/apis/productsService';
import PopularProduct from '../PopularProduct/PopularProduct';
import MyFooter from '@components/Footer/Footer';
import ProductFilters from '../ProductFilters/ProductFilters';
import { applyProductChanges, PRODUCT_CHANGES_EVENT, PRODUCT_CHANGES_STORAGE_KEY } from '../../utils/productStore';

function getCategoryName(product) {
  const category = product.category ?? product.categoryName ?? product.type;
  if (typeof category === 'string') return category;
  return category?.name ?? category?.title ?? '';
}

function HomePage() {
  const [listProducts, setListProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const syncProductChanges = () => {
      setListProducts((current) => applyProductChanges(current));
    };
    const handleStorage = (event) => {
      if (event.key === PRODUCT_CHANGES_STORAGE_KEY) syncProductChanges();
    };
    window.addEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
    window.addEventListener('storage', handleStorage);

    // The API docs say omitting limit returns all products, so client-side search covers the full list.
    getProduct({ sortType: 0 })
      .then((res) => {
        const products = Array.isArray(res?.contents)
          ? res.contents
          : Array.isArray(res?.data?.contents)
            ? res.data.contents
            : Array.isArray(res)
              ? res
              : [];
        if (isMounted) setListProducts(applyProductChanges(products));
      })
      .catch(() => {
        if (isMounted) setLoadError('Không tải được danh sách sản phẩm. Vui lòng thử lại sau.');
      });
    return () => {
      isMounted = false;
      window.removeEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const categories = useMemo(() => [...new Set(listProducts.map(getCategoryName).filter(Boolean))], [listProducts]);
  const filteredProducts = useMemo(() => listProducts.filter((product) => {
    const searchableText = `${product.name ?? ''} ${product.description ?? ''} ${getCategoryName(product)} ${product.manufacturer?.name ?? product.manufacturer ?? ''}`.toLocaleLowerCase('vi');
    const matchesSearch = searchableText.includes(search.trim().toLocaleLowerCase('vi'));
    const matchesCategory = category === 'all' || getCategoryName(product) === category;
    return matchesSearch && matchesCategory;
  }), [listProducts, search, category]);
  const hasSearch = Boolean(search.trim());
  const showFeaturedBanner = category === 'all' && !hasSearch;

  function applySearch(nextSearch, nextCategory) {
    setSearch(nextSearch);
    setCategory(nextCategory);
    window.setTimeout(() => {
      document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  return (
    <>
      <MyHeader
        products={listProducts}
        categories={categories}
        search={search}
        category={category}
        onSearch={applySearch}
      />
      {!hasSearch && <Banner />}
      {!hasSearch && <Info />}
      {!hasSearch && <AdvanceHeading />}
      {!hasSearch && (
        <ProductFilters
          category={category}
          categories={categories}
          onCategoryChange={setCategory}
        />
      )}
      {loadError && <p role='alert'>{loadError}</p>}
      {!loadError && filteredProducts.length === 0 && listProducts.length > 0 && <p>Không tìm thấy sản phẩm phù hợp.</p>}
      <HeadingListProduct
        data={showFeaturedBanner ? filteredProducts.slice(0, 2) : []}
        showCountdown={showFeaturedBanner}
      />
      <PopularProduct
        data={showFeaturedBanner ? filteredProducts.slice(2) : filteredProducts}
        searchMode={hasSearch}
      />
      {!hasSearch && <SalesHomePage />}
      <MyFooter />
    </>
  );
}

export default HomePage;
