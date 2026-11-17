import { FiX } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import useVariantForm from '../hooks/useVariantForm';
import CombinationBuilder from '../CombinationBuilder/CombinationBuilder';
import styles from './styles.module.scss';

function VariantForm({
  products,
  colors,
  sizes,
  variants,
  variant,
  onSave,
  onCancel,
}) {
  const form = useVariantForm({ products, variants, variant, onSave });
  const {
    editing,
    productId,
    selectedProduct,
    defaultPrice,
    defaultSalePrice,
    defaultStock,
    rows,
    errors,
    handleRowsChange,
    handleProductChange,
    handleDefaultChange,
    handleSubmit,
  } = form;

  return (
    <div className={styles.overlay}>
      <section
        className={styles.formCard}
        role='dialog'
        aria-modal='true'
        aria-labelledby='variant-form-title'
      >
        <header className={styles.formHeader}>
          <div>
            <span>QUẢN LÝ SẢN PHẨM</span>
            <h2 id='variant-form-title'>
              {editing ? 'Chỉnh sửa biến thể' : 'Thêm biến thể sản phẩm'}
            </h2>
            <p>Thiết lập màu, kích thước, giá và tồn kho cho từng SKU.</p>
          </div>
          <button
            className={styles.closeButton}
            type='button'
            aria-label='Đóng biểu mẫu'
            onClick={onCancel}
          >
            <FiX />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Sản phẩm</span>
              <select
                value={productId}
                onChange={handleProductChange}
                disabled={editing || rows.length > 0}
                required
                aria-invalid={Boolean(errors.productId)}
              >
                <option value=''>Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId && <small>{errors.productId}</small>}
              {!editing && rows.length > 0 && (
                <small className={styles.fieldHint}>
                  Xóa các tổ hợp hiện tại để đổi sản phẩm.
                </small>
              )}
            </label>

            <label className={styles.field}>
              <span>Giá bán mặc định (₫)</span>
              <input
                type='number'
                min='1'
                value={defaultPrice}
                onChange={(event) =>
                  handleDefaultChange('price', event.target.value)
                }
                disabled={editing}
              />
            </label>
            <label className={styles.field}>
              <span>Giá ưu đãi mặc định (₫)</span>
              <input
                type='number'
                min='0'
                value={defaultSalePrice}
                onChange={(event) =>
                  handleDefaultChange('salePrice', event.target.value)
                }
                disabled={editing}
              />
            </label>
            <label className={styles.field}>
              <span>Tồn kho mặc định</span>
              <input
                type='number'
                min='0'
                step='1'
                value={defaultStock}
                onChange={(event) =>
                  handleDefaultChange('stock', event.target.value)
                }
                disabled={editing}
              />
            </label>
          </div>

          {errors.combinations && (
            <p className={styles.formError} role='alert'>
              {errors.combinations}
            </p>
          )}

          <CombinationBuilder
            key={productId}
            product={selectedProduct}
            colors={colors}
            sizes={sizes}
            rows={rows}
            onRowsChange={handleRowsChange}
            defaults={{
              price: defaultPrice,
              salePrice: defaultSalePrice,
              stock: defaultStock,
            }}
            editing={editing}
            errors={errors}
          />

          <footer className={styles.formActions}>
            <Button
              type='button'
              className={styles.actionButton}
              isPrimary={false}
              onClick={onCancel}
              content='Hủy'
            />
            <Button
              type='submit'
              className={styles.actionButton}
              content={editing ? 'Lưu thay đổi' : 'Lưu biến thể'}
            />
          </footer>
        </form>
      </section>
    </div>
  );
}

export default VariantForm;
