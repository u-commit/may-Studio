import styles from './styles.module.scss';
import Button from '@components/Button/Button.jsx';
import InputCommon from '@components/InputCommon/InputCommon';

const {
  formCard,
  cardHeading,
  formGrid,
  field,
  wideField,
  imagePreviews,
  sizeField,
  sizeOptions,
  sizeOption,
  formActions,
  inputControl,
  actionButton,
} = styles;

function ProductForm({
  form,
  catalog,
  editing,
  imageUploading,
  imageError,
  onChange,
  onToggleSize,
  onAddProductImages,
  onRemoveProductImage,
  onSubmit,
  onCancel,
}) {
  const existingImages = form.images ?? [];
  const uploadedImages = form.uploadedImages ?? [];

  return (
    <form className={formCard} onSubmit={onSubmit}>
      <div className={cardHeading}>
        <div>
          <h2>{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <p>Điền thông tin sản phẩm và số lượng tồn kho.</p>
        </div>
      </div>

      <div className={formGrid}>
        <InputCommon
          className={field}
          inputClassName={inputControl}
          compact
          autoFocus
          id='name'
          label='Tên sản phẩm'
          value={form.name}
          onChange={onChange}
          isRequired
        />

        <SelectField
          label='Loại sản phẩm'
          name='category'
          value={form.category}
          options={catalog.categories}
          onChange={onChange}
        />

        <SelectField
          label='Nhà sản xuất'
          name='manufacturer'
          value={form.manufacturer}
          options={catalog.manufacturers}
          onChange={onChange}
        />

        <SelectField
          label='Màu sắc'
          name='color'
          value={form.color}
          options={catalog.colors}
          onChange={onChange}
        />

        <InputCommon
          className={field}
          inputClassName={inputControl}
          compact
          id='price'
          label='Giá bán (₫)'
          type='number'
          min='1'
          value={form.price}
          onChange={onChange}
          isRequired
        />

        <InputCommon
          className={field}
          inputClassName={inputControl}
          compact
          id='stock'
          label='Tồn kho'
          type='number'
          min='0'
          value={form.stock}
          onChange={onChange}
          isRequired
        />

        <label className={`${field} ${wideField}`}>
          <span>Thêm ảnh từ thiết bị</span>
          <input
            className={styles.imageInput}
            type='file'
            accept='image/*'
            multiple
            disabled={imageUploading || uploadedImages.length >= 4}
            onChange={onAddProductImages}
          />
          {imageUploading && (
            <small className={styles.imageHelp}>Đang tải ảnh…</small>
          )}
          {imageError && (
            <small className={styles.imageError} role='alert'>
              {imageError}
            </small>
          )}
        </label>

        <label className={`${field} ${wideField}`}>
          <span>Thông tin sản phẩm</span>
          <textarea
            name='description'
            value={form.description}
            onChange={onChange}
            rows='3'
            placeholder='Mô tả chất liệu, kiểu dáng và đặc điểm sản phẩm'
          />
        </label>
      </div>

      {(existingImages.length > 0 || uploadedImages.length > 0) && (
        <div className={imagePreviews}>
          {existingImages.map((url, index) => (
            <div className={styles.imagePreview} key={`existing-${index}`}>
              <img src={url} alt={`Ảnh sản phẩm ${index + 1}`} />
              <button
                className={styles.removeImageButton}
                type='button'
                aria-label={`Xóa ảnh sản phẩm ${index + 1}`}
                onClick={() => onRemoveProductImage('existing', index)}
              >
                ×
              </button>
            </div>
          ))}
          {uploadedImages.map((url, index) => (
            <div className={styles.imagePreview} key={`uploaded-${index}`}>
              <img
                src={url}
                alt={`Ảnh sản phẩm tải lên ${index + 1}`}
              />
              <button
                className={styles.removeImageButton}
                type='button'
                aria-label={`Xóa ảnh đã tải lên ${index + 1}`}
                onClick={() => onRemoveProductImage('uploaded', index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <fieldset className={sizeField}>
        <legend>Kích cỡ</legend>
        <div className={sizeOptions}>
          {catalog.sizes.map((size) => (
            <label className={sizeOption} key={size}>
              <input
                type='checkbox'
                checked={form.sizes.includes(size)}
                onChange={() => onToggleSize(size)}
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={formActions}>
        <Button
          type='button'
          className={actionButton}
          isPrimary={false}
          onClick={onCancel}
          content='Hủy'
        />

        <Button
          type='submit'
          className={actionButton}
          disabled={imageUploading}
          content={editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        />
      </div>
    </form>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <label className={field}>
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange} required>
        <option value=''>Chọn {label.toLowerCase()}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ProductForm;
