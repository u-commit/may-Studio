import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '@components/Button/Button';
import MyFooter from '@components/Footer/Footer';
import MyHeader from '@components/Header/Header';
import ShopProductCard from './components/ShopProductCard';
import useShopPage from './hooks/useShopPage';
import styles from './styles.module.scss';
const {
  breadcrumb,
  catalog,
  eyebrow,
  hero,
  heroButton,
  heroCopy,
  listLayout,
  loadMoreButton,
  loadMoreWrap,
  message,
  productGrid,
  searchBox,
  select,
  shopHeading,
  shopPage,
  showCount,
  toolbar,
  toolbarLeft,
} = styles;

function ShopPage() {
  const {
    products,
    categories,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    layout,
    itemsPerPage,
    setItemsPerPage,
    loadMoreProducts,
    hasMoreProducts,
    variantsByProductId,
    visibleProducts,
    loadError,
    onHeaderSearch,
  } = useShopPage();

  const scrollToProducts = () => {
    document.getElementById('shop-products')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <>
      <MyHeader
        products={products}
        categories={categories}
        search={search}
        category={category}
        onSearch={onHeaderSearch}
        transparent={false}
      />
      <main className={shopPage}>
        <div className={breadcrumb}>
          <Link to='/'>Home</Link>
          <span>›</span>
          <span>Our Shop</span>
        </div>

        <section className={hero}>
          <div className={heroCopy}>
            <h1>Phong cách mới,cảm hứng mới</h1>
            <Button
              content='Khám phá ngay'
              variant='primary'
              className={heroButton}
              onClick={scrollToProducts}
              isPrimary
            />
          </div>
        </section>

        <section id='shop-products' className={catalog}>
          <div className={shopHeading}>
            <div>
              <p className={eyebrow}>MÂY STUDIO</p>
              <h2>Our Shop</h2>
            </div>
          </div>

          <div className={toolbar}>
            <div className={toolbarLeft}>
              <label className={searchBox}>
                <FiSearch aria-hidden='true' />
                <input
                  type='search'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Tìm sản phẩm...'
                  aria-label='Tìm sản phẩm'
                />
              </label>
              <select
                className={select}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label='Lọc danh mục'
              >
                <option value='all'>Tất cả danh mục</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className={select}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label='Sắp xếp sản phẩm'
              >
                <option value='default'>Sắp xếp mặc định</option>
                <option value='price-asc'>Giá: thấp đến cao</option>
                <option value='price-desc'>Giá: cao đến thấp</option>
                <option value='name'>Tên sản phẩm</option>
              </select>
            </div>
          </div>

          {loadError ? (
            <p className={message} role='alert'>
              {loadError}
            </p>
          ) : visibleProducts.length === 0 ? (
            <p className={message}>Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div
              className={`${productGrid} ${layout === 'list' ? listLayout : ''}`}
            >
              {visibleProducts.slice(0, itemsPerPage).map((product) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  variants={variantsByProductId.get(String(product.id)) ?? []}
                  listView={layout === 'list'}
                />
              ))}
            </div>
          )}
          {!loadError && hasMoreProducts && (
            <div className={loadMoreWrap}>
              <Button
                content='Xem thêm sản phẩm'
                variant='outline'
                className={loadMoreButton}
                onClick={loadMoreProducts}
              />
            </div>
          )}
        </section>
      </main>
      <MyFooter />
    </>
  );
}

export default ShopPage;
