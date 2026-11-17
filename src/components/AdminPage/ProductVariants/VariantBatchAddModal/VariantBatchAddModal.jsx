import { useState } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import {
  createVariantId,
  createVariantSKU,
  getColorHex,
} from '../../../../apis/productVariantsService';
import { validateVariants } from '../../../../utils/variantValidation';
import Modal from '../Modal/Modal';
import styles from './styles.module.scss';
const { actions, addImage, addRow, dialog, field, fieldGrid, form, formError, header, imageError, imageGrid, imageItem, imageSection, module, rowCard, rowHeading, rowList } = styles;

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

function createDraft(product) {
  return {
    id: 'new-' + createVariantId(),
    productId: String(product.id),
    productName: product.name,
    color: { name: '', hex: '' },
    size: '',
    sku: '',
    price: Number(product.price) || 1,
    salePrice: null,
    stock: 0,
    isActive: true,
    status: 'active',
    images: [],
    image: '',
    skuEdited: false,
  };
}

function VariantBatchAddModal({
  product,
  colors,
  sizes,
  existingVariants,
  onClose,
  onAdd,
}) {
  const [rows, setRows] = useState(() => [createDraft(product)]);
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [readingRows, setReadingRows] = useState({});
  const [formError, setFormError] = useState('');

  const colorOptions = colors.map((color) =>
    typeof color === 'string' ? { name: color, hex: getColorHex(color) } : color
  );
  const isReadingImages = Object.values(readingRows).some(Boolean);

  function updateRow(id, field, value) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        if (field === 'color') {
          const color = colorOptions.find((option) => option.name === value);
          const next = {
            ...row,
            color: { name: value, hex: color?.hex || getColorHex(value) },
          };
          if (!row.skuEdited)
            next.sku =
              value && row.size
                ? createVariantSKU(product, value, row.size)
                : '';
          return next;
        }
        const next = { ...row, [field]: value };
        if (field === 'sku') next.skuEdited = true;
        if (field === 'size' && !row.skuEdited) {
          next.sku =
            row.color.name && value
              ? createVariantSKU(product, row.color.name, value)
              : '';
        }
        return next;
      })
    );
    setErrors((current) => {
      const next = { ...current };
      if (next[id]) {
        next[id] = { ...next[id] };
        delete next[id][field];
        if (field === 'color' || field === 'size') delete next[id].combination;
      }
      return next;
    });
    setFormError('');
  }

  function addRow() {
    setRows((current) => [...current, createDraft(product)]);
    setFormError('');
  }

  function removeRow(id) {
    setRows((current) => current.filter((row) => row.id !== id));
    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setImageErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  async function addImages(id, event) {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    setImageErrors((current) => ({ ...current, [id]: '' }));
    const row = rows.find((item) => item.id === id);
    if (!files.length || !row) return;
    if (files.some((file) => !file.type.startsWith('image/'))) {
      setImageErrors((current) => ({
        ...current,
        [id]: 'Chỉ chọn tệp hình ảnh.',
      }));
      return;
    }
    if (files.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setImageErrors((current) => ({
        ...current,
        [id]: 'Mỗi ảnh không được vượt quá 512 KB.',
      }));
      return;
    }
    if (row.images.length + files.length > MAX_IMAGE_COUNT) {
      setImageErrors((current) => ({
        ...current,
        [id]: 'Mỗi biến thể được thêm tối đa 4 ảnh.',
      }));
      return;
    }
    setReadingRows((current) => ({ ...current, [id]: true }));
    try {
      const images = await Promise.all(files.map(readImage));
      setRows((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                images: [...item.images, ...images],
                image: item.images[0] || images[0] || '',
              }
            : item
        )
      );
    } catch (error) {
      setImageErrors((current) => ({
        ...current,
        [id]: error.message || 'Không đọc được ảnh đã chọn.',
      }));
    } finally {
      setReadingRows((current) => ({ ...current, [id]: false }));
    }
  }

  function removeImage(id, index) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const images = row.images.filter(
          (_, imageIndex) => imageIndex !== index
        );
        return { ...row, images, image: images[0] ?? '' };
      })
    );
  }

  function submit(event) {
    event.preventDefault();
    setFormError('');
    if (!rows.length) {
      setFormError('Hãy thêm ít nhất một biến thể.');
      return;
    }
    const candidates = rows.map((row) => {
      const candidate = { ...row };
      delete candidate.skuEdited;
      return {
        ...candidate,
        price: row.price === '' ? '' : Number(row.price),
        salePrice:
          row.salePrice === '' || row.salePrice == null
            ? null
            : Number(row.salePrice),
        stock: row.stock === '' ? '' : Number(row.stock),
        image: row.images[0] ?? '',
      };
    });
    const nextErrors = validateVariants(
      candidates,
      existingVariants,
      product.id
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFormError('Vui lòng kiểm tra các trường được đánh dấu.');
      return;
    }
    onAdd(candidates);
  }

  return (
    <Modal
      titleId='variant-batch-add-title'
      onClose={onClose}
      contentClassName={dialog}
    >
      <header className={header}>
        <div>
          <h3 id='variant-batch-add-title'>Thêm nhiều loại sản phẩm:</h3>
        </div>
        <Button
          variant='icon'
          type='button'
          aria-label='Đóng thêm biến thể'
          onClick={onClose}
          content={<FiX aria-hidden='true' />}
        />
      </header>

      <form className={form} onSubmit={submit} noValidate>
        <div className={rowList}>
          {rows.map((row, index) => {
            const rowErrors = errors[row.id] ?? {};
            return (
              <section className={rowCard} key={row.id}>
                <div className={rowHeading}>
                  <h3> Loại sản phẩm </h3>
                  <Button
                    variant='ghost'
                    size='compact'
                    type='button'
                    disabled={readingRows[row.id]}
                    onClick={() => removeRow(row.id)}
                    content={
                      <>
                        <FiTrash2 aria-hidden='true' /> Xóa loại sản phẩm
                      </>
                    }
                  />
                </div>

                <div className={fieldGrid}>
                  <label className={field}>
                    <span>Màu sắc</span>
                    <select
                      value={row.color.name}
                      aria-invalid={Boolean(
                        rowErrors.color || rowErrors.combination
                      )}
                      onChange={(event) =>
                        updateRow(row.id, 'color', event.target.value)
                      }
                    >
                      <option value=''>Chọn màu sắc</option>
                      {colorOptions.map((color) => (
                        <option key={color.name} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                      {row.color.name &&
                        !colorOptions.some(
                          (color) => color.name === row.color.name
                        ) && (
                          <option value={row.color.name}>
                            {row.color.name}
                          </option>
                        )}
                    </select>
                    {(rowErrors.color || rowErrors.combination) && (
                      <small role='alert'>
                        {rowErrors.color || rowErrors.combination}
                      </small>
                    )}
                  </label>

                  <label className={field}>
                    <span>Kích thước</span>
                    <select
                      value={row.size}
                      aria-invalid={Boolean(
                        rowErrors.size || rowErrors.combination
                      )}
                      onChange={(event) =>
                        updateRow(row.id, 'size', event.target.value)
                      }
                    >
                      <option value=''>Chọn kích thước</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                      {row.size && !sizes.includes(row.size) && (
                        <option value={row.size}>{row.size}</option>
                      )}
                    </select>
                    {rowErrors.size && (
                      <small role='alert'>{rowErrors.size}</small>
                    )}
                  </label>

                  <label className={field}>
                    <span>SKU</span>
                    <input
                      value={row.sku}
                      aria-invalid={Boolean(rowErrors.sku)}
                      onChange={(event) =>
                        updateRow(row.id, 'sku', event.target.value)
                      }
                      placeholder='Tự tạo từ màu và kích thước'
                    />
                    {rowErrors.sku && (
                      <small role='alert'>{rowErrors.sku}</small>
                    )}
                  </label>

                  <label className={field}>
                    <span>Giá bán (₫)</span>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      value={row.price}
                      aria-invalid={Boolean(rowErrors.price)}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'price',
                          event.target.value === ''
                            ? ''
                            : Number(event.target.value)
                        )
                      }
                    />
                    {rowErrors.price && (
                      <small role='alert'>{rowErrors.price}</small>
                    )}
                  </label>

                  <label className={field}>
                    <span>Giá khuyến mãi (₫)</span>
                    <input
                      type='number'
                      min='0'
                      step='1'
                      value={row.salePrice ?? ''}
                      aria-invalid={Boolean(rowErrors.salePrice)}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'salePrice',
                          event.target.value === ''
                            ? null
                            : Number(event.target.value)
                        )
                      }
                    />
                    {rowErrors.salePrice && (
                      <small role='alert'>{rowErrors.salePrice}</small>
                    )}
                  </label>

                  <label className={field}>
                    <span>Tồn kho</span>
                    <input
                      type='number'
                      min='0'
                      step='1'
                      value={row.stock}
                      aria-invalid={Boolean(rowErrors.stock)}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'stock',
                          event.target.value === ''
                            ? ''
                            : Number(event.target.value)
                        )
                      }
                    />
                    {rowErrors.stock && (
                      <small role='alert'>{rowErrors.stock}</small>
                    )}
                  </label>
                </div>

                <fieldset className={imageSection}>
                  <legend>Ảnh riêng cho loại sản phẩm</legend>
                  <div className={imageGrid}>
                    {row.images.map((image, imageIndex) => (
                      <div className={imageItem} key={imageIndex}>
                        <img src={image} alt={'Ảnh ' + (imageIndex + 1)} />
                        <Button
                          variant='icon'
                          type='button'
                          aria-label={'Xóa ảnh ' + (imageIndex + 1)}
                          onClick={() => removeImage(row.id, imageIndex)}
                          content={<FiX aria-hidden='true' />}
                        />
                      </div>
                    ))}
                    {row.images.length < MAX_IMAGE_COUNT && (
                      <label className={addImage}>
                        <input
                          type='file'
                          accept='image/*'
                          multiple
                          aria-label={'Thêm ảnh cho biến thể ' + (index + 1)}
                          disabled={readingRows[row.id]}
                          onChange={(event) => addImages(row.id, event)}
                        />
                        <FiUpload aria-hidden='true' />
                        <span>
                          {readingRows[row.id] ? 'Đang đọc ảnh…' : 'Thêm ảnh'}
                        </span>
                      </label>
                    )}
                  </div>
                  {imageErrors[row.id] && (
                    <small className={imageError} role='alert'>
                      {imageErrors[row.id]}
                    </small>
                  )}
                </fieldset>
              </section>
            );
          })}
        </div>

        {formError && (
          <p className={formError} role='alert'>
            {formError}
          </p>
        )}

        <div className={addRow}>
          <Button
            variant='outline'
            size='compact'
            type='button'
            onClick={addRow}
            content={
              <>
                <FiPlus aria-hidden='true' /> Thêm loại sản phẩm
              </>
            }
          />
        </div>

        <footer className={actions}>
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
            disabled={isReadingImages}
            content='Thêm vào danh sách'
          />
        </footer>
      </form>
    </Modal>
  );
}

export default VariantBatchAddModal;
