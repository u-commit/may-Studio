import { useState } from 'react';
import {
  FiEdit2,
  FiLayers,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import { getColorHex } from '../../../apis/productVariantsService';
import Modal from './Modal/Modal';
import VariantEditModal from './VariantEditModal/VariantEditModal';
import VariantBatchAddModal from './VariantBatchAddModal/VariantBatchAddModal';
import VariantDeleteModal from './VariantDeleteModal/VariantDeleteModal';
import useProductVariantEditor from './hooks/useProductVariantEditor';
import styles from './styles.module.scss';

function formatNumber(value) {
  if (value === '' || value == null) return '';
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString('vi-VN') : '';
}

function CurrencyInput({ value, label, error, onChange }) {
  const [text, setText] = useState(formatNumber(value));
  const [focused, setFocused] = useState(false);

  return (
    <>
      <input
        className={styles.cellInput}
        aria-label={label}
        aria-invalid={Boolean(error)}
        inputMode='numeric'
        value={focused ? text : formatNumber(value)}
        onFocus={() => {
          setText(String(value ?? ''));
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const nextText = event.target.value;
          setText(nextText);
          const digits = nextText.replace(/[^\d]/g, '');
          onChange(digits ? Number(digits) : '');
        }}
      />
      {error && (
        <small className={styles.cellError} role='alert'>
          {error}
        </small>
      )}
    </>
  );
}

function ProductVariants({
  product,
  products,
  catalog,
  allVariants,
  onClose,
  onSaved,
}) {
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const editor = useProductVariantEditor({
    product,
    products,
    allVariants,
    onClose,
    onSaved,
  });
  const {
    draftVariants,
    filteredVariants,
    summary,
    loading,
    saving,
    loadError,
    saveError,
    fieldErrors,
    query,
    statusFilter,
    editingVariant,
    deletingVariant,
    headerImage,
    hasChanges,
    setQuery,
    setStatusFilter,
    changeVariant,
    addVariants,
    editVariant,
    cancelEditVariant,
    deleteVariant,
    saveEditedVariant,
    confirmDelete,
    saveChanges,
  } = editor;
  const colorOptions = [
    ...new Set([
      ...(catalog?.colors ?? []),
      ...draftVariants.map((variant) => variant.color?.name).filter(Boolean),
    ]),
  ];
  const sizeOptions = [
    ...new Set([
      ...(catalog?.sizes ?? []),
      ...draftVariants.map((variant) => variant.size).filter(Boolean),
    ]),
  ];

  function cancelAndClose() {
    onClose?.();
  }

  return (
    <>
      <Modal
        titleId='product-variants-title'
        onClose={cancelAndClose}
        contentClassName={styles.dialog}
      >
        <div className={styles.page}>
          <header className={styles.header}>
            <div className={styles.productHeading}>
              <div className={styles.productImage}>
                {headerImage ? (
                  <img src={headerImage} alt='' />
                ) : (
                  <FiLayers aria-hidden='true' />
                )}
              </div>
              <div className={styles.headingCopy}>
                <h2 id='product-variants-title'>{product.name}</h2>
                <p>
                  {product.id} · {summary.count} biến thể ·{' '}
                  {summary.stock.toLocaleString('vi-VN')} tồn kho ·{' '}
                  {summary.activeCount} đang bán
                </p>
              </div>
            </div>
            <Button
              variant='icon'
              type='button'
              aria-label='Đóng quản lý biến thể'
              onClick={cancelAndClose}
              content={<FiX aria-hidden='true' />}
            />
          </header>

          <div className={styles.toolbar}>
            <label className={styles.searchBox}>
              <FiSearch aria-hidden='true' />
              <input
                aria-label='Tìm theo SKU, màu, cỡ'
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Tìm theo SKU, màu, cỡ…'
              />
            </label>
            <div
              className={styles.filters}
              aria-label='Lọc trạng thái biến thể'
            >
              {[
                ['all', 'Tất cả'],
                ['active', 'Đang bán'],
                ['inactive', 'Ngừng bán'],
              ].map(([value, label]) => (
                <Button
                  key={value}
                  variant={statusFilter === value ? 'admin-primary' : 'outline'}
                  size='compact'
                  type='button'
                  aria-pressed={statusFilter === value}
                  onClick={() => setStatusFilter(value)}
                  content={label}
                />
              ))}
            </div>
            <Button
              variant='admin-primary'
              size='compact'
              className={styles.addButton}
              type='button'
              disabled={loading}
              onClick={() => setBatchModalOpen(true)}
              content={
                <>
                  <FiPlus aria-hidden='true' /> Thêm biến thể
                </>
              }
            />
          </div>

          {loadError && (
            <div className={styles.notice} role='alert'>
              <span>{loadError}</span>
              <Button
                variant='outline'
                size='compact'
                type='button'
                onClick={editor.retry}
                content='Thử lại'
              />
            </div>
          )}

          <div className={styles.tableViewport}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.imageCol} />
                <col className={styles.colorCol} />
                <col className={styles.sizeCol} />
                <col className={styles.skuCol} />
                <col className={styles.priceCol} />
                <col className={styles.saleCol} />
                <col className={styles.stockCol} />
                <col className={styles.activeCol} />
                <col className={styles.actionsCol} />
              </colgroup>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Màu sắc</th>
                  <th>Cỡ</th>
                  <th>SKU</th>
                  <th>Giá bán</th>
                  <th>Giá KM</th>
                  <th>Tồn kho</th>
                  <th>Bán</th>
                  <th>
                    <span className={styles.visuallyHidden}>Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filteredVariants.map((variant) => {
                    const errors = fieldErrors[variant.id] ?? {};
                    const images =
                      variant.images ?? (variant.image ? [variant.image] : []);
                    return (
                      <tr key={variant.id}>
                        <td>
                          <div
                            className={styles.variantImage}
                            style={{
                              '--swatch-color': getColorHex(
                                variant.color?.name
                              ),
                            }}
                          >
                            {images[0] ? (
                              <img src={images[0]} alt='' />
                            ) : (
                              <span />
                            )}
                          </div>
                        </td>
                        <td>
                          <select
                            className={styles.cellInput}
                            aria-label={`Màu sắc ${variant.sku || 'mới'}`}
                            aria-invalid={Boolean(
                              errors.color || errors.combination
                            )}
                            value={variant.color?.name ?? ''}
                            onChange={(event) =>
                              changeVariant(
                                variant.id,
                                'color',
                                event.target.value
                              )
                            }
                          >
                            <option value=''>Chọn màu</option>
                            {colorOptions.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                          {(errors.color || errors.combination) && (
                            <small className={styles.cellError} role='alert'>
                              {errors.color || errors.combination}
                            </small>
                          )}
                        </td>
                        <td>
                          <select
                            className={styles.cellInput}
                            aria-label={`Kích thước ${variant.sku || 'mới'}`}
                            aria-invalid={Boolean(
                              errors.size || errors.combination
                            )}
                            value={variant.size ?? ''}
                            onChange={(event) =>
                              changeVariant(
                                variant.id,
                                'size',
                                event.target.value
                              )
                            }
                          >
                            <option value=''>Chọn cỡ</option>
                            {sizeOptions.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                          {errors.size && (
                            <small className={styles.cellError} role='alert'>
                              {errors.size}
                            </small>
                          )}
                        </td>
                        <td>
                          <input
                            className={styles.cellInput}
                            aria-label={`SKU biến thể ${variant.color?.name || ''} ${variant.size || ''}`}
                            aria-invalid={Boolean(errors.sku)}
                            value={variant.sku ?? ''}
                            onChange={(event) =>
                              changeVariant(
                                variant.id,
                                'sku',
                                event.target.value
                              )
                            }
                          />
                          {errors.sku && (
                            <small className={styles.cellError} role='alert'>
                              {errors.sku}
                            </small>
                          )}
                        </td>
                        <td>
                          <CurrencyInput
                            label={`Giá bán ${variant.sku || 'mới'}`}
                            value={variant.price}
                            error={errors.price}
                            onChange={(value) =>
                              changeVariant(variant.id, 'price', value)
                            }
                          />
                        </td>
                        <td>
                          <CurrencyInput
                            label={`Giá khuyến mãi ${variant.sku || 'mới'}`}
                            value={variant.salePrice}
                            error={errors.salePrice}
                            onChange={(value) =>
                              changeVariant(variant.id, 'salePrice', value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            className={styles.cellInput}
                            type='number'
                            min='0'
                            step='1'
                            aria-label={`Tồn kho ${variant.sku || 'mới'}`}
                            aria-invalid={Boolean(errors.stock)}
                            value={variant.stock ?? ''}
                            onChange={(event) =>
                              changeVariant(
                                variant.id,
                                'stock',
                                event.target.value === ''
                                  ? ''
                                  : Number(event.target.value)
                              )
                            }
                          />
                          {errors.stock && (
                            <small className={styles.cellError} role='alert'>
                              {errors.stock}
                            </small>
                          )}
                        </td>
                        <td>
                          <Button
                            variant='ghost'
                            size='compact'
                            className={styles.switch}
                            type='button'
                            role='switch'
                            aria-checked={
                              variant.isActive ?? variant.status === 'active'
                            }
                            aria-label={`Đang bán ${variant.sku || 'biến thể mới'}`}
                            onClick={() =>
                              changeVariant(
                                variant.id,
                                'isActive',
                                !(
                                  variant.isActive ??
                                  variant.status === 'active'
                                )
                              )
                            }
                            content={<i />}
                          />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <Button
                              variant='icon'
                              type='button'
                              aria-label={`Chỉnh sửa ${variant.sku || 'biến thể mới'}`}
                              onClick={() => editVariant(variant)}
                              content={<FiEdit2 aria-hidden='true' />}
                            />
                            <Button
                              variant='icon'
                              type='button'
                              aria-label={`Xóa ${variant.sku || 'biến thể mới'}`}
                              onClick={() => deleteVariant(variant)}
                              content={<FiTrash2 aria-hidden='true' />}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {loading && (
                  <tr>
                    <td className={styles.emptyState} colSpan='9'>
                      Đang tải biến thể…
                    </td>
                  </tr>
                )}
                {!loading && filteredVariants.length === 0 && (
                  <tr>
                    <td className={styles.emptyState} colSpan='9'>
                      {draftVariants.length
                        ? 'Không có biến thể phù hợp.'
                        : 'Sản phẩm chưa có biến thể.'}
                      {!draftVariants.length && (
                        <Button
                          variant='outline'
                          size='compact'
                          type='button'
                          onClick={() => setBatchModalOpen(true)}
                          content='Thêm biến thể'
                        />
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {saveError && (
            <p className={styles.saveError} role='alert'>
              {saveError}
            </p>
          )}
          <footer className={styles.footer}>
            <span>
              {draftVariants.length} biến thể ·{' '}
              {summary.stock.toLocaleString('vi-VN')} tồn kho ·{' '}
              {summary.activeCount} đang bán
            </span>
            <div>
              <Button
                variant='ghost'
                size='compact'
                type='button'
                onClick={cancelAndClose}
                content='Hủy bỏ'
              />
              <Button
                variant='admin-primary'
                size='compact'
                type='button'
                disabled={!hasChanges || saving || loading}
                onClick={saveChanges}
                content={saving ? 'Đang lưu…' : 'Lưu thay đổi'}
              />
            </div>
          </footer>
        </div>
      </Modal>

      {batchModalOpen && (
        <VariantBatchAddModal
          product={product}
          colors={colorOptions}
          sizes={sizeOptions}
          existingVariants={[
            ...allVariants.filter(
              (variant) => String(variant.productId) !== String(product.id)
            ),
            ...draftVariants,
          ]}
          onClose={() => setBatchModalOpen(false)}
          onAdd={(variants) => {
            addVariants(variants);
            setBatchModalOpen(false);
          }}
        />
      )}

      {editingVariant && (
        <VariantEditModal
          key={editingVariant.id}
          variant={editingVariant}
          existingVariants={allVariants}
          colors={colorOptions}
          sizes={sizeOptions}
          productId={product.id}
          onClose={cancelEditVariant}
          onSave={saveEditedVariant}
        />
      )}
      {deletingVariant && (
        <VariantDeleteModal
          variant={deletingVariant}
          onCancel={() => deleteVariant(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default ProductVariants;
