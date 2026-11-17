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
    loading,
    saving,
    loadError,
    saveError,
    fieldErrors,
    query,
    statusFilter,
    editingVariant,
    deletingVariant,
    deleting,
    deleteError,
    headerImage,
    hasChanges,
    setQuery,
    setStatusFilter,
    addVariants,
    editVariant,
    cancelEditVariant,
    deleteVariant,
    cancelDelete,
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
  const validationVariants = [
    ...allVariants.filter(
      (variant) => String(variant.productId) !== String(product.id)
    ),
    ...draftVariants,
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
                  <FiPlus aria-hidden='true' /> Thêm loại sản phẩm
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
                    const isActive = Boolean(
                      variant.isActive ?? variant.status === 'active'
                    );
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
                          <span className={styles.colorValue}>
                            <i
                              aria-hidden='true'
                              style={{
                                '--swatch-color':
                                  variant.color?.hex ||
                                  getColorHex(variant.color?.name),
                              }}
                            />
                            {variant.color?.name || '—'}
                          </span>
                          {(errors.color || errors.combination) && (
                            <small className={styles.cellError} role='alert'>
                              {errors.color || errors.combination}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={styles.readOnlyValue}>
                            {variant.size || '—'}
                          </span>
                          {(errors.size || errors.combination) && (
                            <small className={styles.cellError} role='alert'>
                              {errors.size || errors.combination}
                            </small>
                          )}
                        </td>
                        <td>
                          <span
                            className={`${styles.readOnlyValue} ${styles.skuValue}`}
                            title={variant.sku || ''}
                          >
                            {variant.sku || '—'}
                          </span>
                          {errors.sku && (
                            <small className={styles.cellError} role='alert'>
                              {errors.sku}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={styles.readOnlyValue}>
                            {formatNumber(variant.price) || '—'}
                          </span>
                          {errors.price && (
                            <small className={styles.cellError} role='alert'>
                              {errors.price}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={styles.readOnlyValue}>
                            {formatNumber(variant.salePrice) || '—'}
                          </span>
                          {errors.salePrice && (
                            <small className={styles.cellError} role='alert'>
                              {errors.salePrice}
                            </small>
                          )}
                        </td>
                        <td>
                          <span className={styles.readOnlyValue}>
                            {formatNumber(variant.stock) || '0'}
                          </span>
                          {errors.stock && (
                            <small className={styles.cellError} role='alert'>
                              {errors.stock}
                            </small>
                          )}
                        </td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}
                          >
                            {isActive ? 'Đang bán' : 'Ngừng bán'}
                          </span>
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
                              aria-label={`Xóa loại sản phẩm ${variant.sku || ''}`}
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
                      Đang tải loại sản pphẩm...
                    </td>
                  </tr>
                )}
                {!loading && filteredVariants.length === 0 && (
                  <tr>
                    <td className={styles.emptyState} colSpan='9'>
                      {draftVariants.length
                        ? 'Không có loại sản phẩm  phù hợp.'
                        : 'Sản phẩm chưa có loại sản phẩm.'}
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
          existingVariants={validationVariants}
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
          existingVariants={validationVariants}
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
          deleting={deleting}
          error={deleteError}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default ProductVariants;
