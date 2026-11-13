import { FiRotateCcw, FiSearch } from 'react-icons/fi';
import styles from './styles.module.scss';
function VariantFilters({ colors, sizes, filters, onChange, onReset, total }) {
  const {
    filterGrid,
    filtersCard,
    searchField,
    selectField,
    resetButton,
    resultCount,
  } = styles;
  return (
    <section className={filtersCard} aria-label='Tìm kiếm và lọc biến thể'>
      <div className={filterGrid}>
        <label className={searchField}>
          <FiSearch aria-hidden='true' />
          <input
            aria-label='Tìm theo tên sản phẩm hoặc SKU'
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder='Tìm tên sản phẩm hoặc SKU'
          />
        </label>
        <label className={selectField}>
          <span>Màu sắc</span>
          <select
            aria-label='Màu sắc'
            value={filters.color}
            onChange={(event) => onChange('color', event.target.value)}
          >
            <option value='all'>Tất cả màu</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
        <label className={selectField}>
          <span>Kích thước</span>
          <select
            aria-label='Kích thước'
            value={filters.size}
            onChange={(event) => onChange('size', event.target.value)}
          >
            <option value='all'>Tất cả kích thước</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <label className={selectField}>
          <span>Trạng thái</span>
          <select
            aria-label='Trạng thái'
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <option value='all'>Tất cả trạng thái</option>
            <option value='active'>Đang hoạt động</option>
            <option value='inactive'>Ngừng hoạt động</option>
            <option value='out'>Hết hàng</option>
            <option value='low'>Sắp hết hàng</option>
          </select>
        </label>
        <label className={selectField}>
          <span>Khoảng tồn kho</span>
          <select
            aria-label='Khoảng tồn kho'
            value={filters.stock}
            onChange={(event) => onChange('stock', event.target.value)}
          >
            <option value='all'>Mọi mức tồn kho</option>
            <option value='zero'>0 sản phẩm</option>
            <option value='low'>1–5 sản phẩm</option>
            <option value='available'>Trên 5 sản phẩm</option>
          </select>
        </label>
        <button className={resetButton} type='button' onClick={onReset}>
          <FiRotateCcw aria-hidden='true' /> Đặt lại
        </button>
      </div>
      <p className={resultCount}>
        {total.toLocaleString('vi-VN')} biến thể phù hợp
      </p>
    </section>
  );
}

export default VariantFilters;
