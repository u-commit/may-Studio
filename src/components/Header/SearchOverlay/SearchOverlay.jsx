import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './styles.module.scss';
const { module } = styles;

function getCategoryName(product) {
  const value = product.category ?? product.categoryName ?? product.type;
  if (typeof value === 'string') return value;
  return value?.name ?? value?.title ?? '';
}

function getProductImage(product) {
  const image = product.images?.[0] ?? product.imageUrl ?? product.image;
  return typeof image === 'string' ? image : (image?.url ?? image?.src ?? '');
}

function SearchOverlay({
  open,
  products,
  categories,
  currentSearch,
  currentCategory,
  onClose,
  onSearch,
}) {
  const [query, setQuery] = useState(currentSearch);
  const [category, setCategory] = useState(currentCategory);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const {
    overlay,
    closeButton,
    content,
    searchForm,
    trending,
    popularSection,
    categoryGrid,
    categoryCard,
    categoryImage,
    viewAllButton,
  } = styles;
  useEffect(() => {
    if (!open) return;
    setQuery(currentSearch);
    setCategory(currentCategory);
    setShowAllCategories(false);
  }, [open, currentSearch, currentCategory]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  const categoryCards = useMemo(() => {
    const items = [
      {
        name: 'Tất cả',
        value: 'all',
        count: products.length,
        image: getProductImage(products[0] ?? {}),
      },
    ];
    categories.forEach((name) => {
      const categoryProducts = products.filter(
        (product) => getCategoryName(product) === name
      );
      items.push({
        name,
        value: name,
        count: categoryProducts.length,
        image: getProductImage(categoryProducts[0] ?? {}),
      });
    });
    return items;
  }, [categories, products]);

  if (!open) return null;

  function submit(event) {
    event.preventDefault();
    onSearch(query, category);
  }

  function searchTrending(term) {
    onSearch(term, category);
  }

  const visibleCategories = showAllCategories
    ? categoryCards
    : categoryCards.slice(0, 3);

  return createPortal(
    <div
      className={overlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby='search-overlay-title'
    >
      <button
        className={closeButton}
        type='button'
        onClick={onClose}
        aria-label='Đóng tìm kiếm'
      >
        <FiX />
      </button>
      <main className={content}>
        <h1 id='search-overlay-title'>Bạn đang tìm sản phẩm nào?</h1>
        <form className={searchForm} onSubmit={submit}>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label='Chọn danh mục'
          >
            <option value='all'>Tất cả danh mục</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            autoFocus
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Tìm sản phẩm'
            aria-label='Từ khóa tìm kiếm'
          />
          <button type='submit'>
            <FiSearch /> Tìm kiếm
          </button>
        </form>

        <div className={trending}>
          <span>Từ khóa nổi bật:</span>
          {categories.slice(0, 4).map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => searchTrending(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section className={popularSection}>
          <h2>Danh mục phổ biến</h2>
          <div className={categoryGrid}>
            {visibleCategories.map((item) => (
              <button
                className={categoryCard}
                key={item.value}
                type='button'
                onClick={() => onSearch('', item.value)}
              >
                <span className={categoryImage}>
                  {item.image ? (
                    <img src={item.image} alt='' />
                  ) : (
                    <span>{item.name.slice(0, 1)}</span>
                  )}
                </span>
                <strong>{item.name}</strong>
                <small>{item.count} sản phẩm</small>
              </button>
            ))}
          </div>
          {categoryCards.length > 3 && (
            <button
              className={viewAllButton}
              type='button'
              onClick={() => setShowAllCategories((current) => !current)}
            >
              {showAllCategories ? 'Thu gọn danh mục' : 'Xem tất cả danh mục'}
            </button>
          )}
        </section>
      </main>
    </div>,
    document.body
  );
}

export default SearchOverlay;
