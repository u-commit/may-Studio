import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import Button from '@components/Button/Button.jsx';
import useVariantManagement from './hooks/useVariantManagement';
import VariantStats from './VariantStats/VariantStats';
import VariantFilters from './VariantFilters/VariantFilters';
import VariantTable from './VariantTable/VariantTable';
import VariantForm from './VariantForm/VariantForm';
import VariantDetail from './VariantDetail/VariantDetail';
import VariantDeleteModal from './VariantDeleteModal/VariantDeleteModal';
import styles from './styles.module.scss';

function ProductVariants({ products, catalog, productsLoading }) {
  const management = useVariantManagement({
    products,
    catalog,
    productsLoading,
  });
  const {
    variants,
    ready,
    filters,
    colors,
    sizes,
    stats,
    filteredVariants,
    pageVariants,
    currentPage,
    pageCount,
    rangeStart,
    rangeEnd,
    selectedIds,
    formOpen,
    editingVariant,
    detailVariant,
    deleteTarget,
    changeFilter,
    resetFilters,
    selectVariant,
    selectCurrentPage,
    openCreateForm,
    openEditForm,
    closeForm,
    saveVariants,
    confirmDelete,
    requestDelete,
    requestBulkDelete,
    closeDetail,
    editDetail,
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
    openDetail,
    closeDelete,
  } = management;

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headingCopy}>
          <span className={styles.eyebrow}>SẢN PHẨM & KHO HÀNG</span>
          <h1>Quản lý biến thể sản phẩm</h1>
          <p>Theo dõi SKU, màu sắc, kích thước và tồn kho của từng tổ hợp.</p>
        </div>
        <Button
          type='button'
          className={styles.addButton}
          onClick={openCreateForm}
          disabled={!products.length}
          content='Thêm biến thể'
        />
      </header>

      <VariantStats stats={stats} />
      <VariantFilters
        colors={colors}
        sizes={sizes}
        filters={filters}
        onChange={changeFilter}
        onReset={resetFilters}
        total={filteredVariants.length}
      />

      <div className={styles.listToolbar}>
        <div>
          <strong>Danh sách biến thể</strong>
          <span>{variants.length.toLocaleString('vi-VN')} bản ghi</span>
        </div>
        {selectedIds.length > 0 && (
          <div className={styles.selectedActions}>
            <Button
              type='button'
              isPrimary={false}
              className={styles.bulkDeleteButton}
              onClick={requestBulkDelete}
              content={
                <>
                  <FiTrash2 aria-hidden='true' /> Xóa đã chọn
                </>
              }
            />
          </div>
        )}
      </div>

      <VariantTable
        variants={pageVariants}
        selectedIds={selectedIds}
        loading={productsLoading || !ready}
        onSelect={selectVariant}
        onSelectAll={selectCurrentPage}
        onView={openDetail}
        onEdit={openEditForm}
        onDelete={requestDelete}
      />

      <footer className={styles.pagination}>
        <span>
          Hiển thị {rangeStart}–{rangeEnd} trong{' '}
          {filteredVariants.length.toLocaleString('vi-VN')} kết quả
        </span>
        <div>
          <button
            type='button'
            aria-label='Trang trước'
            disabled={currentPage <= 1}
            onClick={goToPreviousPage}
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <button
                type='button'
                key={page}
                className={page === currentPage ? styles.currentPage : ''}
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}
          <button
            type='button'
            aria-label='Trang sau'
            disabled={currentPage >= pageCount}
            onClick={goToNextPage}
          >
            <FiChevronRight />
          </button>
        </div>
      </footer>

      {formOpen && (
        <VariantForm
          key={editingVariant?.id ?? 'new-variant'}
          products={products}
          colors={colors}
          sizes={sizes}
          variants={variants}
          variant={editingVariant}
          onSave={saveVariants}
          onCancel={closeForm}
        />
      )}
      {detailVariant && (
        <VariantDetail
          variant={detailVariant}
          onClose={closeDetail}
          onEdit={editDetail}
        />
      )}
      {deleteTarget && (
        <VariantDeleteModal
          variants={deleteTarget}
          onCancel={closeDelete}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}

export default ProductVariants;
