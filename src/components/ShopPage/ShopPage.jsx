import { useEffect, useMemo, useState } from 'react';
import { FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getProduct } from '@/apis/productsService';
import MyFooter from '@components/Footer/Footer';
import MyHeader from '@components/Header/Header';
import { getColorHex } from '@/apis/productVariantsService';
import { normalizeProductList } from '@components/AdminPage/productAdapter';
import useStorefrontVariants from '@components/ProductItem/useStorefrontVariants';
import {
  applyProductChanges,
  PRODUCT_CHANGES_EVENT,
  PRODUCT_CHANGES_STORAGE_KEY,
} from '@/utils/productStore';
import heroImage from '@/assets/images/Banner.webp';
import styles from './styles.module.scss';

function getCategoryName(product) {
  const category = product.category ?? product.categoryName ?? product.type;
  if (typeof category === 'string') return category;
  return category?.name ?? category?.title ?? '';
}

function getId(product) {
  return String(product?.id ?? product?._id ?? product?.productId ?? '');
}

function getActiveVariants(variants = []) {
  return variants.filter((variant) => variant.status === 'active');
}

function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${amount.toLocaleString('vi-VN')} ₫` : '—';
}

function getStartingPrice(product, variants) {
  const activeVariants = getActiveVariants(variants);
  if (!activeVariants.length) return Number(product.price) || 0;
  return Math.min(
    ...activeVariants.map((variant) =>
      Number(variant.salePrice) > 0
        ? Number(variant.salePrice)
        : Number(variant.price) || 0
    )
  );
}

function ShopProductCard({ product, variants, listView }) {
  const activeVariants = getActiveVariants(variants);
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
  const manufacturer = product.manufacturer || getCategoryName(product);

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

  return (
    <article className={`${styles.productCard} ${listView ? styles.listCard : ''}`}>
      <div className={styles.productImage}>
        {image ? (
          <img src={image} alt={product.name} loading='lazy' />
        ) : (
          <span className={styles.imagePlaceholder}>MÂY STUDIO</span>
        )}
      </div>
      <div className={styles.productInfo}>
        {availableColors.length > 0 && (
          <div className={styles.colorOptions} aria-label='Màu sắc'>
            {availableColors.map((variant) => (
              <button
                key={variant.color.name}
                type='button'
                className={`${styles.colorSwatch} ${variant.color.name === currentColor ? styles.selectedSwatch : ''}`}
                style={{ '--swatch': variant.color.hex || getColorHex(variant.color.name) }}
                aria-label={`Màu ${variant.color.name}`}
                aria-pressed={variant.color.name === currentColor}
                onClick={() => chooseColor(variant.color.name)}
              />
            ))}
          </div>
        )}
        {sizes.length > 0 && (
          <div className={styles.sizeOptions} aria-label='Kích cỡ'>
            {sizes.map((size) => (
              <button
                key={size}
                type='button'
                className={`${styles.sizeChip} ${selectedVariant?.size === size ? styles.selectedSize : ''}`}
                aria-pressed={selectedVariant?.size === size}
                onClick={() => chooseSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        <h2 className={styles.productName}>{product.name}</h2>
        {manufacturer && <p className={styles.manufacturer}>{manufacturer}</p>}
        <div className={styles.priceLine}>
          {salePrice > 0 && regularPrice > salePrice && (
            <span className={styles.oldPrice}>{formatPrice(regularPrice)}</span>
          )}
          <span className={styles.price}>{formatPrice(displayPrice)}</span>
        </div>
      </div>
    </article>
  );
}

function ShopPage() {
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
          setLoadError('Không tải được danh sách sản phẩm. Vui lòng thử lại sau.');
        }
      });

    return () => {
      isMounted = false;
      window.removeEventListener(PRODUCT_CHANGES_EVENT, syncProductChanges);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map(getCategoryName).filter(Boolean))],
    [products]
  );
  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi');
    const filtered = products.filter((product) => {
      const searchText = [
        product.name,
        product.description,
        getCategoryName(product),
        product.manufacturer,
      ]
        .join(' ')
        .toLocaleLowerCase('vi');
      return (
        searchText.includes(normalizedSearch) &&
        (category === 'all' || getCategoryName(product) === category)
      );
    });
    const sorted = [...filtered];
    if (sortBy === 'price-asc') {
      sorted.sort(
        (a, b) =>
          getStartingPrice(a, variantsByProductId.get(getId(a))) -
          getStartingPrice(b, variantsByProductId.get(getId(b)))
      );
    } else if (sortBy === 'price-desc') {
      sorted.sort(
        (a, b) =>
          getStartingPrice(b, variantsByProductId.get(getId(b))) -
          getStartingPrice(a, variantsByProductId.get(getId(a)))
      );
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return sorted;
  }, [products, search, category, sortBy, variantsByProductId]);

  const onHeaderSearch = (query, selectedCategory) => {
    setSearch(query);
    setCategory(selectedCategory);
    document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' });
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
      <main className={styles.shopPage}>
        <div className={styles.breadcrumb}>
          <Link to='/'>Home</Link><span>›</span><span>Our Shop</span>
        </div>

        <section className={styles.hero} style={{ '--shop-hero': `url(${heroImage})` }}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>MÂY STUDIO — BỘ SƯU TẬP MỚI</p>
            <h1>The classics make a comeback</h1>
            <a href='#shop-products' className={styles.heroButton}>Khám phá ngay</a>
          </div>
        </section>

        <section id='shop-products' className={styles.catalog}>
          <div className={styles.shopHeading}>
            <div>
              <p className={styles.eyebrow}>MÂY STUDIO</p>
              <h2>Our Shop</h2>
            </div>
            <p className={styles.resultCount}>{visibleProducts.length} sản phẩm</p>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <label className={styles.searchBox}>
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
                className={styles.select}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label='Lọc danh mục'
              >
                <option value='all'>Tất cả danh mục</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <select
                className={styles.select}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label='Sắp xếp sản phẩm'
              >
                <option value='default'>Sắp xếp mặc định</option>
                <option value='price-asc'>Giá: thấp đến cao</option>
                <option value='price-desc'>Giá: cao đến thấp</option>
                <option value='name'>Tên sản phẩm</option>
              </select>
              <div className={styles.viewToggle} aria-label='Kiểu hiển thị'>
                <button
                  type='button'
                  className={layout === 'grid' ? styles.activeView : ''}
                  onClick={() => setLayout('grid')}
                  aria-label='Hiển thị dạng lưới'
                  aria-pressed={layout === 'grid'}
                ><FiGrid /></button>
                <button
                  type='button'
                  className={layout === 'list' ? styles.activeView : ''}
                  onClick={() => setLayout('list')}
                  aria-label='Hiển thị dạng danh sách'
                  aria-pressed={layout === 'list'}
                ><FiList /></button>
              </div>
            </div>
            <label className={styles.showCount}>
              <span>Hiển thị</span>
              <select
                className={styles.select}
                value={itemsPerPage}
                onChange={(event) => setItemsPerPage(Number(event.target.value))}
                aria-label='Số sản phẩm hiển thị'
              >
                {[8, 12, 16].map((count) => <option key={count} value={count}>{count}</option>)}
              </select>
            </label>
          </div>

          {loadError ? (
            <p className={styles.message} role='alert'>{loadError}</p>
          ) : visibleProducts.length === 0 ? (
            <p className={styles.message}>Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div className={`${styles.productGrid} ${layout === 'list' ? styles.listLayout : ''}`}>
              {visibleProducts.slice(0, itemsPerPage).map((product) => (
                <ShopProductCard
                  key={getId(product)}
                  product={product}
                  variants={variantsByProductId.get(getId(product)) ?? []}
                  listView={layout === 'list'}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <MyFooter />
    </>
  );
}

export default ShopPage;
