import Button from '@components/Button/Button.jsx';
import Modal from '../Modal/Modal';
import styles from './styles.module.scss';

function VariantDeleteModal({ variant, onCancel, onConfirm }) {
  return (
    <Modal
      alert
      titleId='variant-delete-title'
      onClose={onCancel}
      contentClassName={styles.dialog}
    >
      <h2 id='variant-delete-title'>Xóa biến thể?</h2>
      <p>
        {variant.sku} ({variant.color?.name || 'Không màu'} ·{' '}
        {variant.size || 'Không cỡ'}) sẽ bị xóa khỏi sản phẩm.
      </p>
      <footer className={styles.actions}>
        <Button
          variant='ghost'
          size='compact'
          type='button'
          onClick={onCancel}
          content='Hủy bỏ'
        />
        <Button
          variant='danger'
          size='compact'
          type='button'
          onClick={onConfirm}
          content='Xóa'
        />
      </footer>
    </Modal>
  );
}

export default VariantDeleteModal;
