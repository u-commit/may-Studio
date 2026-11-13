import { useContext, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLayers,
  FiPackage,
} from 'react-icons/fi';
import { ToastContext } from '../../../../contexts/ToastProvide';
import {
  createVariantId,
  getColorHex,
} from '../../../../apis/productVariantsService';
import useProductVariants from './useProductVariants';
import { getVariantStatus } from '../variantStatus';

const PAGE_SIZE = 8;
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const EMPTY_FILTERS = {
  query: '',
  color: 'all',
  size: 'all',
  status: 'all',
  stock: 'all',
};

function useVariantManagement({ products, catalog, productsLoading }) {
  const { variants, ready, updateVariants } = useProductVariants(
    products,
    !productsLoading
  );
  const toastContext = useContext(ToastContext);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [detailVariant, setDetailVariant] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const colors = useMemo(
    () => [
      ...new Set([
        ...(catalog?.colors ?? []),
        ...variants.map((variant) => variant.color?.name).filter(Boolean),
      ]),
    ],
    [catalog?.colors, variants]
  );
  const sizes = useMemo(
    () => [...new Set([...APPAREL_SIZES, ...(catalog?.sizes ?? [])])],
    [catalog?.sizes]
  );
  const filteredVariants = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('vi');
    return variants.filter((variant) => {
      const searchable =
        `${variant.productName} ${variant.sku}`.toLocaleLowerCase('vi');
      const stock = Number(variant.stock) || 0;
      return (
        (!query || searchable.includes(query)) &&
        (filters.color === 'all' || variant.color?.name === filters.color) &&
        (filters.size === 'all' || variant.size === filters.size) &&
        (filters.status === 'all' ||
          getVariantStatus(variant) === filters.status) &&
        (filters.stock === 'all' ||
          (filters.stock === 'zero' && stock === 0) ||
          (filters.stock === 'low' && stock > 0 && stock <= 5) ||
          (filters.stock === 'available' && stock > 5))
      );
    });
  }, [variants, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredVariants.length / PAGE_SIZE));
  const pageVariants = filteredVariants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const rangeStart = filteredVariants.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredVariants.length);
  const stats = useMemo(
    () => [
      { label: 'Tổng biến thể', value: variants.length, icon: FiLayers },
      {
        label: 'Đang hoạt động',
        value: variants.filter((variant) => variant.status === 'active').length,
        icon: FiCheckCircle,
      },
      {
        label: 'Hết hàng',
        value: variants.filter((variant) => Number(variant.stock) === 0).length,
        icon: FiPackage,
      },
      {
        label: 'Sắp hết hàng',
        value: variants.filter(
          (variant) => Number(variant.stock) > 0 && Number(variant.stock) <= 5
        ).length,
        icon: FiAlertCircle,
      },
    ],
    [variants]
  );

  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setCurrentPage(1);
    setSelectedIds([]);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
    setSelectedIds([]);
  }

  function selectVariant(id, checked) {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id)
    );
  }

  function selectCurrentPage(checked) {
    const pageIds = pageVariants.map((variant) => variant.id);
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, ...pageIds])]
        : current.filter((id) => !pageIds.includes(id))
    );
  }

  function openCreateForm() {
    setEditingVariant(null);
    setFormOpen(true);
  }

  function openEditForm(variant) {
    setDetailVariant(null);
    setEditingVariant(variant);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingVariant(null);
  }

  function saveVariants(rows, product) {
    const timestamp = new Date().toISOString();
    const savedRows = rows.map((row) => {
      const isEditingRow = editingVariant && row.id === editingVariant.id;
      return {
        id: isEditingRow ? editingVariant.id : createVariantId(),
        productId: String(product.id),
        productName: product.name,
        sku: String(row.sku).trim(),
        color: {
          name: row.color.name,
          hex: row.color.hex || getColorHex(row.color.name),
        },
        size: row.size,
        price: Number(row.price),
        salePrice:
          row.salePrice === '' || row.salePrice == null
            ? 0
            : Number(row.salePrice),
        stock: Number(row.stock),
        image: row.image ?? '',
        status: row.status,
        createdAt: isEditingRow ? editingVariant.createdAt : timestamp,
        updatedAt: timestamp,
      };
    });
    const editingId = editingVariant?.id;
    const next = editingId
      ? variants.map((variant) =>
          variant.id === editingId ? savedRows[0] : variant
        )
      : [...savedRows, ...variants];
    updateVariants(next);
    closeForm();
    setCurrentPage(1);
    setSelectedIds([]);
    toastContext?.toast?.success(
      editingId
        ? 'Đã cập nhật biến thể.'
        : `Đã thêm ${savedRows.length} biến thể.`
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const ids = new Set(deleteTarget.map((variant) => variant.id));
    updateVariants(variants.filter((variant) => !ids.has(variant.id)));
    const removedVisibleCount = filteredVariants.filter((variant) =>
      ids.has(variant.id)
    ).length;
    if (removedVisibleCount > 0) {
      const remainingVisible = filteredVariants.length - removedVisibleCount;
      const lastPage = Math.max(1, Math.ceil(remainingVisible / PAGE_SIZE));
      setCurrentPage((page) => Math.min(page, lastPage));
    }
    setSelectedIds((current) => current.filter((id) => !ids.has(id)));
    setDeleteTarget(null);
    toastContext?.toast?.success(
      ids.size > 1 ? `Đã xóa ${ids.size} biến thể.` : 'Đã xóa biến thể.'
    );
  }

  function requestDelete(variant) {
    setDeleteTarget([variant]);
  }

  function requestBulkDelete() {
    const selected = variants.filter((variant) =>
      selectedIds.includes(variant.id)
    );
    if (selected.length) setDeleteTarget(selected);
  }

  function closeDetail() {
    setDetailVariant(null);
  }

  function openDetail(variant) {
    setDetailVariant(variant);
  }

  function closeDelete() {
    setDeleteTarget(null);
  }

  function editDetail() {
    if (detailVariant) openEditForm(detailVariant);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(pageCount, page + 1));
  }

  return {
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
    openDetail,
    closeDelete,
    editDetail,
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
  };
}

export default useVariantManagement;
