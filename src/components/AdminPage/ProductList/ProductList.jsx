import { useMemo, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from './styles.module.scss';

function ProductList({
  products,
  categories,
  loading,
  loadError,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.trim().toLocaleLowerCase('vi');
        const text =
          `${product.name} ${product.id} ${product.manufacturer} ${product.description ?? ''}`.toLocaleLowerCase(
            'vi'
          );
        return (
          (!query || text.includes(query)) &&
          (category === 'all' || product.category === category)
        );
      }),
    [products, search, category]
  );
  const {
    productList,
    cardHeading,
    toolbar,
    searchBox,
    filterSelect,
    tableScroll,
    table,
    status,
    statusActive,
    statusWarning,
    statusInactive,
    productCell,
    productThumb,
    rowActions,
    rowButton,
    emptyState,
  } = styles;

  return (
    <section className={productList}>
      <div className={cardHeading}>
        <div>
          <h2>Danh sách sản phẩm</h2>
          <p>Tìm kiếm, lọc và cập nhật sản phẩm.</p>
        </div>
      </div>
      <div className={toolbar}>
        <label className={searchBox}>
          <FiSearch />
          <input
            aria-label='Tìm sản phẩm'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Tìm theo tên, mã sản phẩm...'
          />
        </label>
        <select
          className={filterSelect}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label='Lọc theo loại sản phẩm'
        >
          <option value='all'>Tất cả loại</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className={tableScroll}>
        <table className={table}>
          <thead>
            <tr>
              <th>SẢN PHẨM</th>
              <th>LOẠI</th>
              <th>MÀU / SIZE</th>
              <th>GIÁ BÁN</th>
              <th>TỒN KHO</th>
              <th>TRẠNG THÁI</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => {
              const stock = Number(product.stock);
              const status =
                stock === 0 ? 'Hết hàng' : stock < 5 ? 'Sắp hết' : 'Đang bán';
              const statusClass =
                stock === 0
                  ? statusInactive
                  : stock < 5
                    ? statusWarning
                    : statusActive;
              return (
                <tr key={product.id}>
                  <td>
                      <div className={productCell}>
                        <div className={productThumb}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <span>Ảnh</span>
                        )}
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <small>
                          {product.id} · {product.manufacturer}
                        </small>
                        <p>
                          {product.description || 'Chưa có thông tin sản phẩm.'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    {product.color}
                    <small>{(product.sizes ?? []).join(', ') || '—'}</small>
                  </td>
                  <td>{Number(product.price).toLocaleString('vi-VN')} ₫</td>
                  <td>{stock}</td>
                  <td>
                    <span className={`${status} ${statusClass}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className={rowActions}>
                      <button
                        className={rowButton}
                        type='button'
                        aria-label={`Sửa ${product.name}`}
                        onClick={() => onEdit(product)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={rowButton}
                        type='button'
                        aria-label={`Xóa ${product.name}`}
                        onClick={() => onDelete(product.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visibleProducts.length === 0 && (
              <tr>
                <td className={emptyState} colSpan='7'>
                  {loading
                    ? 'Đang tải sản phẩm...'
                    : loadError
                      ? 'Không thể hiển thị sản phẩm.'
                      : 'Không tìm thấy sản phẩm.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductList;
