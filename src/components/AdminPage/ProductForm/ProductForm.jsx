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
  onChange,
  onToggleSize,
  onSubmit,
  onCancel,
}) {
  const imageUrls = form.imagesText
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

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

        <InputCommon
          className={`${field} ${wideField}`}
          inputClassName={inputControl}
          compact
          id='imagesText'
          label='Ảnh sản phẩm (dán một hoặc nhiều đường dẫn, ngăn cách bằng dấu phẩy)'
          value={form.imagesText}
          onChange={onChange}
          placeholder='https://.../san-pham.jpg'
        />

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

      {imageUrls.length > 0 && (
        <div className={imagePreviews}>
          {imageUrls.map((url) => (
            <img key={url} src={url} alt='Xem trước sản phẩm' />
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
