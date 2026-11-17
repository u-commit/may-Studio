import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import { validateVariants } from '../../../../utils/variantValidation';
import Modal from '../Modal/Modal';
import styles from './styles.module.scss';

const MAX_IMAGE_COUNT = 4;
const MAX_IMAGE_BYTES = 512 * 1024;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Không đọc được ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });
}

function VariantEditModal({
  variant,
  existingVariants,
  colors,
  sizes,
  productId,
  onClose,
  onSave,
}) {
  const [draft, setDraft] = useState(() => ({
    ...variant,
    color: { ...(variant.color ?? {}) },
    images: [...(variant.images ?? (variant.image ? [variant.image] : []))],
  }));
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [readingImages, setReadingImages] = useState(false);

  function update(field, value) {
    setDraft((current) => ({
      ...current,
      ...(field === 'color'
        ? { color: { ...current.color, name: value } }
        : { [field]: value }),
    }));
  }

  async function addImages(event) {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    setImageError('');
    const invalidType = files.some((file) => !file.type.startsWith('image/'));
    const tooLarge = files.some((file) => file.size > MAX_IMAGE_BYTES);
    if (invalidType) {
      setImageError('Chỉ chọn tệp hình ảnh.');
      return;
    }
    if (tooLarge) {
      setImageError('Mỗi ảnh không được vượt quá 512 KB.');
      return;
    }
    if (draft.images.length + files.length > MAX_IMAGE_COUNT) {
      setImageError(`Mỗi biến thể được thêm tối đa ${MAX_IMAGE_COUNT} ảnh.`);
      return;
    }
    setReadingImages(true);
    try {
      const images = await Promise.all(files.map(readImage));
      setDraft((current) => ({
        ...current,
        images: [...current.images, ...images],
      }));
    } catch (error) {
      setImageError(error.message);
    } finally {
      setReadingImages(false);
    }
  }

  function save(event) {
    event.preventDefault();
    const nextDraft = {
      ...draft,
      price: draft.price === '' ? '' : Number(draft.price),
      salePrice:
        draft.salePrice === '' || draft.salePrice == null
          ? null
          : Number(draft.salePrice),
      stock: draft.stock === '' ? '' : Number(draft.stock),
      isActive: Boolean(draft.isActive),
      status: draft.isActive ? 'active' : 'inactive',
      image: draft.images[0] ?? '',
    };
    const nextErrors = validateVariants(
      [nextDraft],
      existingVariants,
      productId
    );
    const rowErrors = nextErrors[nextDraft.id] ?? {};
    setErrors(rowErrors);
    if (Object.keys(rowErrors).length) return;
    onSave(nextDraft);
  }

  return (
    <Modal
      titleId='variant-edit-title'
      onClose={onClose}
      contentClassName={styles.dialog}
    >
      <header className={styles.header}>
        <h2 id='variant-edit-title'>Chỉnh sửa loại sản phẩm</h2>
        <Button
          variant='icon'
          type='button'
          aria-label='Đóng chỉnh sửa biến thể'
          onClick={onClose}
          content={<FiX aria-hidden='true' />}
        />
      </header>
      <form className={styles.form} onSubmit={save} noValidate>
        <label className={styles.field}>
          <span>SKU</span>
          <input
            value={draft.sku ?? ''}
            onChange={(event) => update('sku', event.target.value)}
            aria-invalid={Boolean(errors.sku)}
          />
          {errors.sku && <small role='alert'>{errors.sku}</small>}
        </label>
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>Màu sắc</span>
            <select
              value={draft.color.name ?? ''}
              onChange={(event) => update('color', event.target.value)}
              aria-invalid={Boolean(errors.color)}
            >
              <option value=''>Chọn màu sắc</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            {errors.color && <small role='alert'>{errors.color}</small>}
          </label>
          <label className={styles.field}>
            <span>Kích thước</span>
            <select
              value={draft.size ?? ''}
              onChange={(event) => update('size', event.target.value)}
              aria-invalid={Boolean(errors.size)}
            >
              <option value=''>Chọn kích thước</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.size && <small role='alert'>{errors.size}</small>}
          </label>
          <label className={styles.field}>
            <span>Giá bán (₫)</span>
            <input
              type='number'
              min='1'
              step='1'
              value={draft.price ?? ''}
              onChange={(event) => update('price', event.target.value)}
              aria-invalid={Boolean(errors.price)}
            />
            {errors.price && <small role='alert'>{errors.price}</small>}
          </label>
          <label className={styles.field}>
            <span>Giá khuyến mãi (₫)</span>
            <input
              type='number'
              min='0'
              step='1'
              value={draft.salePrice ?? ''}
              onChange={(event) => update('salePrice', event.target.value)}
              aria-invalid={Boolean(errors.salePrice)}
            />
            {errors.salePrice && <small role='alert'>{errors.salePrice}</small>}
          </label>
          <label className={styles.field}>
            <span>Tồn kho</span>
            <input
              type='number'
              min='0'
              step='1'
              value={draft.stock ?? ''}
              onChange={(event) => update('stock', event.target.value)}
              aria-invalid={Boolean(errors.stock)}
            />
            {errors.stock && <small role='alert'>{errors.stock}</small>}
          </label>
          <div className={styles.switchField}>
            <span>Đang bán</span>
            <Button
              variant='ghost'
              size='compact'
              className={styles.switch}
              type='button'
              role='switch'
              aria-checked={Boolean(draft.isActive)}
              aria-label='Trạng thái đang bán'
              onClick={() => update('isActive', !draft.isActive)}
              content={<i />}
            />
          </div>
        </div>

        <fieldset className={styles.imageSection}>
          <legend>Hình ảnh biến thể</legend>
          <div className={styles.imageGrid}>
            {draft.images.map((image, index) => (
              <div
                className={styles.imageItem}
                key={`${index}-${image.slice(0, 24)}`}
              >
                <img src={image} alt={`Ảnh biến thể ${index + 1}`} />
                {index === 0 ? (
                  <span className={styles.primaryLabel}>Ảnh chính</span>
                ) : (
                  <Button
                    variant='ghost'
                    size='compact'
                    type='button'
                    onClick={() =>
                      setDraft((current) => {
                        const images = [...current.images];
                        images.unshift(...images.splice(index, 1));
                        return { ...current, images };
                      })
                    }
                    content='Đặt làm chính'
                  />
                )}
                <Button
                  variant='icon'
                  type='button'
                  className={styles.removeImage}
                  aria-label={`Xóa ảnh ${index + 1}`}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      images: current.images.filter(
                        (_, imageIndex) => imageIndex !== index
                      ),
                    }))
                  }
                  content={<FiX aria-hidden='true' />}
                />
              </div>
            ))}
            <label className={styles.addImage}>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={addImages}
                disabled={readingImages}
              />
              <FiPlus aria-hidden='true' />
              <span>{readingImages ? 'Đang đọc ảnh…' : 'Thêm ảnh'}</span>
            </label>
          </div>
          {imageError && (
            <p className={styles.imageError} role='alert'>
              {imageError}
            </p>
          )}
        </fieldset>

        <footer className={styles.actions}>
          <Button
            variant='ghost'
            size='compact'
            type='button'
            onClick={onClose}
            content='Hủy bỏ'
          />
          <Button
            variant='admin-primary'
            size='compact'
            type='submit'
            content='Lưu'
          />
        </footer>
      </form>
    </Modal>
  );
}

export default VariantEditModal;
