import Button from '@components/Button/Button.jsx';
import Modal from '../Modal/Modal';
import styles from './styles.module.scss';
const { actions, dialog, error, module } = styles;

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
      contentClassName={dialog}
    >
      <h2 id='variant-delete-title'>Xóa loại sản phẩm</h2>
      <p>
        Loại sản phẩm có SKU {variant.sku || 'chưa có SKU'} (
        {variant.color?.name || 'Không màu'} · {variant.size || 'Không cỡ'}) sẽ
        bị xóa ngay khỏi sản phẩm.
      </p>
      {error && (
        <p className={error} role='alert'>
          {error}
        </p>
      )}
      <footer className={actions}>
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
