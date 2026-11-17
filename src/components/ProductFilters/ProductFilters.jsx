import styles from './styles.module.scss';
const { module } = styles;
import Button from '@components/Button/Button.jsx';
function ProductFilters({ category, categories, onCategoryChange }) {
  const { filters, categoryBrowser, categoryChip, categoryActive } = styles;
  return (
    <section
      id='product-list'
      className={filters}
      aria-label='Tìm kiếm và lọc sản phẩm'
    >
      <div className={categoryBrowser} aria-label='Danh mục sản phẩm'>
        <span>Danh mục sản phẩm</span>
        <Button
          className={category === 'all' ? categoryActive : categoryChip}
          content={'Tất cả'}
          onClick={() => onCategoryChange('all')}
          isPrimary
        >
          Tất cả
        </Button>
        {categories.map((item) => (
          <Button
            className={category === item ? categoryActive : categoryChip}
            key={item}
            type='button'
            onClick={() => onCategoryChange(item)}
            content={item}
          >
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default ProductFilters;
