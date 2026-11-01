import styles from './styles.module.scss';

function ProductFilters({ category, categories, onCategoryChange }) {
  return (
    <section id="product-list" className={styles.filters} aria-label="Tìm kiếm và lọc sản phẩm">
      <div className={styles.categoryBrowser} aria-label="Danh mục sản phẩm">
        <span>Danh mục sản phẩm</span>
        <button className={category === 'all' ? styles.categoryActive : styles.categoryChip} type="button" onClick={() => onCategoryChange('all')}>Tất cả</button>
        {categories.map((item) => (
          <button className={category === item ? styles.categoryActive : styles.categoryChip} key={item} type="button" onClick={() => onCategoryChange(item)}>{item}</button>
        ))}
      </div>
    </section>
  );
}

export default ProductFilters;
