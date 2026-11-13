import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getVariantStatus, VARIANT_STATUS_LABELS } from '../variantStatus';
import { formatVariantCurrency } from '../variantFormatters';
import styles from './styles.module.scss';

function VariantTable({
  variants,
  selectedIds,
  loading,
  onSelect,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
}) {
  const allSelected =
    variants.length > 0 &&
    variants.every((item) => selectedIds.includes(item.id));
  const classByStatus = {
    active: styles.statusActive,
    inactive: styles.statusInactive,
    out: styles.statusOut,
    low: styles.statusLow,
  };

  return (
    <section className={styles.tableCard} aria-label='Danh sách biến thể'>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxColumn}>
                <input
                  type='checkbox'
                  aria-label='Chọn tất cả biến thể đang hiển thị'
                  checked={allSelected}
                  onChange={(event) => onSelectAll(event.target.checked)}
                />
              </th>
              <th>SẢN PHẨM</th>
              <th>SKU</th>
              <th>MÀU</th>
              <th>SIZE</th>
              <th>GIÁ BÁN</th>
              <th>GIÁ ƯU ĐÃI</th>
              <th>TỒN KHO</th>
              <th>TRẠNG THÁI</th>
              <th className={styles.actionsHeading}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => {
              const status = getVariantStatus(variant);
              return (
                <tr key={variant.id}>
                  <td className={styles.checkboxColumn}>
                    <input
                      type='checkbox'
                      aria-label={`Chọn ${variant.sku}`}
                      checked={selectedIds.includes(variant.id)}
                      onChange={(event) =>
                        onSelect(variant.id, event.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productImage}>
                        {variant.image ? (
                          <img src={variant.image} alt='' />
                        ) : (
                          <span>Ảnh</span>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <strong>{variant.productName}</strong>
                        <small>{variant.productId}</small>
                      </div>
                    </div>
                  </td>
                  <td className={styles.sku}>{variant.sku}</td>
                  <td>
                    <span className={styles.colorCell}>
                      <i
                        style={{
                          '--swatch-color': variant.color?.hex || '#d9dfd8',
                        }}
                      />
                      {variant.color?.name || '—'}
                    </span>
                  </td>
                  <td>{variant.size || '—'}</td>
                  <td>{formatVariantCurrency(variant.price)}</td>
                  <td>
                    {Number(variant.salePrice) > 0
                      ? formatVariantCurrency(variant.salePrice)
                      : '—'}
                  </td>
                  <td
                    className={
                      Number(variant.stock) <= 5 ? styles.stockLow : ''
                    }
                  >
                    {Number(variant.stock) || 0}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${classByStatus[status]}`}
                    >
                      {VARIANT_STATUS_LABELS[status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type='button'
                        aria-label={`Xem ${variant.sku}`}
                        title='Xem chi tiết'
                        onClick={() => onView(variant)}
                      >
                        <FiEye />
                      </button>
                      <button
                        type='button'
                        aria-label={`Sửa ${variant.sku}`}
                        title='Chỉnh sửa'
                        onClick={() => onEdit(variant)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type='button'
                        aria-label={`Xóa ${variant.sku}`}
                        title='Xóa'
                        onClick={() => onDelete(variant)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {variants.length === 0 && (
              <tr>
                <td className={styles.emptyState} colSpan='10'>
                  {loading
                    ? 'Đang tải dữ liệu biến thể...'
                    : 'Không tìm thấy biến thể phù hợp.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VariantTable;
