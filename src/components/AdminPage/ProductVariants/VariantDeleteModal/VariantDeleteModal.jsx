import Button from '@components/Button/Button.jsx';
import Modal from '../Modal/Modal';
import styles from './styles.module.scss';

function VariantDeleteModal({
  variant,
  deleting = false,
  error = '',
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      alert
      titleId='variant-delete-title'
      onClose={deleting ? undefined : onCancel}
      closeOnBackdrop={!deleting}
      contentClassName={styles.dialog}
    >
      <h2 id='variant-delete-title'>Xóa loại sản phẩm</h2>
      <p>
        Loại sản phẩm có SKU {variant.sku || 'chưa có SKU'} (
        {variant.color?.name || 'Không màu'} · {variant.size || 'Không cỡ'}) sẽ
        bị xóa ngay khỏi sản phẩm.
      </p>
      {error && (
        <p className={styles.error} role='alert'>
          {error}
        </p>
      )}
      <footer className={styles.actions}>
        <Button
          variant='ghost'
          size='compact'
          type='button'
          disabled={deleting}
          onClick={onCancel}
          content='Hủy bỏ'
        />
        <Button
          variant='danger'
          size='compact'
          type='button'
          disabled={deleting}
          onClick={onConfirm}
          content={deleting ? 'Đang xóa…' : 'Xóa ngay'}
        />
      </footer>
    </Modal>
  );
}

export default VariantDeleteModal;
