import { useMemo, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import styles from '../styles.module.scss';
import componentStyles from './styles.module.scss';

function ProductList({ products, categories, loading, loadError, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const visibleProducts = useMemo(() => products.filter((product) => {
    const query = search.trim().toLocaleLowerCase('vi');
    const text = `${product.name} ${product.id} ${product.manufacturer} ${product.description ?? ''}`.toLocaleLowerCase('vi');
    return (!query || text.includes(query)) && (category === 'all' || product.category === category);
  }), [products, search, category]);

  return (
    <section className={`${styles.dataCard} ${componentStyles.productList}`}>
      <div className={styles.cardHeading}><div><h2>Danh sách sản phẩm <span className={styles.count}>{products.length}</span></h2><p>Tìm kiếm, lọc và cập nhật sản phẩm.</p></div></div>
      <div className={styles.toolbar}>
        <label className={styles.searchBox}><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, mã sản phẩm..." /></label>
        <select className={styles.filterSelect} value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Lọc theo loại sản phẩm"><option value="all">Tất cả loại</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead><tr><th>SẢN PHẨM</th><th>LOẠI</th><th>MÀU / SIZE</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th>TRẠNG THÁI</th><th /></tr></thead>
          <tbody>
            {visibleProducts.map((product) => {
              const stock = Number(product.stock);
              const status = stock === 0 ? 'Hết hàng' : stock < 5 ? 'Sắp hết' : 'Đang bán';
              const statusClass = stock === 0 ? styles.statusInactive : stock < 5 ? styles.statusWarning : styles.statusActive;
              return (
                <tr key={product.id}>
                  <td>
                    <div className={componentStyles.productCell}>
                      <div className={componentStyles.productThumb}>
                        {product.images?.[0] ? <img src={product.images[0]} alt={product.name} /> : <span>Ảnh</span>}
                      </div>
                      <div><strong>{product.name}</strong><small>{product.id} · {product.manufacturer}</small><p>{product.description || 'Chưa có thông tin sản phẩm.'}</p></div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.color}<small>{product.sizes.join(', ')}</small></td>
                  <td>{Number(product.price).toLocaleString('vi-VN')} ₫</td>
                  <td>{stock}</td>
                  <td><span className={`${styles.status} ${statusClass}`}>{status}</span></td>
                  <td><div className={styles.rowActions}><button className={styles.rowButton} type="button" aria-label={`Sửa ${product.name}`} onClick={() => onEdit(product)}><FiEdit2 /></button><button className={styles.rowButton} type="button" aria-label={`Xóa ${product.name}`} onClick={() => onDelete(product.id)}><FiTrash2 /></button></div></td>
                </tr>
              );
            })}
            {visibleProducts.length === 0 && <tr><td className={styles.emptyState} colSpan="7">{loading ? 'Đang tải sản phẩm...' : loadError ? 'Không thể hiển thị sản phẩm.' : 'Không tìm thấy sản phẩm.'}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductList;
