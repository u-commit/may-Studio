import { FiX } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import { getVariantStatus, VARIANT_STATUS_LABELS } from '../variantStatus';
import { formatVariantCurrency, formatVariantDate } from '../variantFormatters';
import styles from './styles.module.scss';

function VariantDetail({ variant, onEdit, onClose }) {
  const details = [
    ['SKU', variant.sku],
    ['Màu sắc', variant.color?.name || '—'],
    ['Kích thước', variant.size || '—'],
    ['Giá bán', formatVariantCurrency(variant.price)],
    [
      'Giá ưu đãi',
      Number(variant.salePrice) > 0
        ? formatVariantCurrency(variant.salePrice)
        : '—',
    ],
    ['Tồn kho', `${Number(variant.stock) || 0} sản phẩm`],
    ['Trạng thái', VARIANT_STATUS_LABELS[getVariantStatus(variant)]],
    ['Ngày tạo', formatVariantDate(variant.createdAt)],
    ['Cập nhật', formatVariantDate(variant.updatedAt)],
  ];

  return (
    <div
      className={styles.backdrop}
      role='presentation'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.dialog}
        role='dialog'
        aria-modal='true'
        aria-labelledby='variant-detail-title'
      >
        <header className={styles.header}>
          <div>
            <span>CHI TIẾT BIẾN THỂ</span>
            <h2 id='variant-detail-title'>{variant.productName}</h2>
            <p>Mã sản phẩm: {variant.productId}</p>
          </div>
          <button type='button' aria-label='Đóng chi tiết' onClick={onClose}>
            <FiX />
          </button>
        </header>
        <div className={styles.body}>
          <div className={styles.image}>
            {variant.image ? (
              <img
                src={variant.image}
                alt={`${variant.productName} ${variant.color?.name}`}
              />
            ) : (
              <span>Chưa có hình ảnh</span>
            )}
          </div>
          <dl className={styles.detailsList}>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <footer className={styles.actions}>
          <Button
            type='button'
            isPrimary={false}
            className={styles.actionButton}
            onClick={onClose}
            content='Đóng'
          />
          <Button
            type='button'
            className={styles.actionButton}
            onClick={onEdit}
            content='Chỉnh sửa'
          />
        </footer>
      </section>
    </div>
  );
}

export default VariantDetail;
