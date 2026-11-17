import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '@components/Button/Button';
import MyFooter from '@components/Footer/Footer';
import MyHeader from '@components/Header/Header';
import ShopProductCard from './components/ShopProductCard';
import useShopPage from './hooks/useShopPage';
import heroImage from '@/assets/images/Banner.webp';
import styles from './styles.module.scss';
const { breadcrumb, catalog, eyebrow, hero, heroButton, heroCopy, listLayout, loadMoreButton, loadMoreWrap, message, productGrid, searchBox, select, shopHeading, shopPage, showCount, toolbar, toolbarLeft } = styles;

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

        <section
          className={hero}
          style={{ '--shop-hero': `url(${heroImage})` }}
        >
          <div className={heroCopy}>
            <p className={eyebrow}>MÂY STUDIO — BỘ SƯU TẬP MỚI</p>
            <h1>The classics make a comeback</h1>
            <a href='#shop-products' className={heroButton}>
              Khám phá ngay
            </a>
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
            <label className={showCount}>
              <span>Hiển thị</span>
              <select
                className={select}
                value={itemsPerPage}
                onChange={(event) =>
                  setItemsPerPage(Number(event.target.value))
                }
                aria-label='Số sản phẩm hiển thị'
              >
                {[...new Set([8, 12, 16, ...(itemsPerPage > 16 ? [itemsPerPage] : [])])].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>
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
