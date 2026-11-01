import styles from '../styles.module.scss';
import componentStyles from './styles.module.scss';

function ProductForm({ form, catalog, editing, onChange, onToggleSize, onSubmit, onCancel }) {
  const imageUrls = form.imagesText.split(',').map((url) => url.trim()).filter(Boolean);

  return (
    <form className={`${styles.formCard} ${componentStyles.productForm}`} onSubmit={onSubmit}>
      <div className={styles.cardHeading}><div><h2>{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2><p>Điền thông tin sản phẩm và số lượng tồn kho.</p></div></div>
      <div className={styles.formGrid}>
        <label className={styles.field}><span>Tên sản phẩm</span><input autoFocus name="name" value={form.name} onChange={onChange} required /></label>
        <SelectField label="Loại sản phẩm" name="category" value={form.category} options={catalog.categories} onChange={onChange} />
        <SelectField label="Nhà sản xuất" name="manufacturer" value={form.manufacturer} options={catalog.manufacturers} onChange={onChange} />
        <SelectField label="Màu sắc" name="color" value={form.color} options={catalog.colors} onChange={onChange} />
        <label className={styles.field}><span>Giá bán (₫)</span><input name="price" type="number" min="1" value={form.price} onChange={onChange} required /></label>
        <label className={styles.field}><span>Tồn kho</span><input name="stock" type="number" min="0" value={form.stock} onChange={onChange} required /></label>
        <label className={`${styles.field} ${componentStyles.wideField}`}><span>Ảnh sản phẩm (dán một hoặc nhiều đường dẫn, ngăn cách bằng dấu phẩy)</span><input name="imagesText" value={form.imagesText} onChange={onChange} placeholder="https://.../san-pham.jpg" /></label>
        <label className={`${styles.field} ${componentStyles.wideField}`}><span>Thông tin sản phẩm</span><textarea name="description" value={form.description} onChange={onChange} rows="3" placeholder="Mô tả chất liệu, kiểu dáng và đặc điểm sản phẩm" /></label>
      </div>
      {imageUrls.length > 0 && <div className={componentStyles.imagePreviews}>{imageUrls.map((url) => <img key={url} src={url} alt="Xem trước sản phẩm" />)}</div>}
      <fieldset className={styles.sizeField}>
        <legend>Kích cỡ</legend>
        <div className={styles.sizeOptions}>
          {catalog.sizes.map((size) => <label className={styles.sizeOption} key={size}><input type="checkbox" checked={form.sizes.includes(size)} onChange={() => onToggleSize(size)} /><span>{size}</span></label>)}
        </div>
      </fieldset>
      <div className={styles.formActions}><button className={styles.secondaryButton} type="button" onClick={onCancel}>Hủy</button><button className={styles.primaryButton} type="submit">{editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button></div>
    </form>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return <label className={styles.field}><span>{label}</span><select name={name} value={value} onChange={onChange} required><option value="">Chọn {label.toLowerCase()}</option>{options.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>;
}

export default ProductForm;
