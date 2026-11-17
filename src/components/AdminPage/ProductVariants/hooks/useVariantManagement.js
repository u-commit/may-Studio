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

function useVariantManagement({
  products,
  catalog,
  productsLoading,
  productId,
}) {
  const {
    variants: allVariants,
    ready,
    updateVariants: saveAllVariants,
  } = useProductVariants(products, !productsLoading);
  const variants = useMemo(
    () =>
      productId == null
        ? allVariants
        : allVariants.filter(
            (variant) => String(variant.productId) === String(productId)
          ),
    [allVariants, productId]
  );
  function updateVariants(nextVariants) {
    if (productId == null) return saveAllVariants(nextVariants);
    const preservedVariants = allVariants.filter(
      (variant) => String(variant.productId) !== String(productId)
    );
    return saveAllVariants([...preservedVariants, ...nextVariants]);
  }
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
  const variantCounts = useMemo(() => {
    const counts = new Map();
    variants.forEach((variant) => {
      const productId = String(variant.productId);
      counts.set(productId, (counts.get(productId) ?? 0) + 1);
    });
    return counts;
  }, [variants]);
  const filteredVariants = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('vi');
    return variants.filter((variant) => {
      const searchable =
        `${variant.productName ?? ''} ${variant.sku ?? ''}`.toLocaleLowerCase(
          'vi'
        );
      const stock = Math.max(0, Number(variant.stock) || 0);
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
  const visiblePage = Math.min(currentPage, pageCount);
  const pageVariants = filteredVariants.slice(
    (visiblePage - 1) * PAGE_SIZE,
    visiblePage * PAGE_SIZE
  );
  const rangeStart = filteredVariants.length
    ? (visiblePage - 1) * PAGE_SIZE + 1
    : 0;
  const rangeEnd = Math.min(visiblePage * PAGE_SIZE, filteredVariants.length);
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
        value: variants.filter((variant) => getVariantStatus(variant) === 'out')
          .length,
        icon: FiPackage,
      },
      {
        label: 'Sắp hết hàng',
        value: variants.filter((variant) => getVariantStatus(variant) === 'low')
          .length,
        icon: FiAlertCircle,
      },
    ],
    [variants]
  );
  const selectedCount = variants.filter((variant) =>
    selectedIds.includes(variant.id)
  ).length;

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
    if (!rows.length || !product?.id) {
      toastContext?.toast?.error?.('Thiếu sản phẩm hoặc biến thể để lưu.');
      return false;
    }
    const editingId = editingVariant?.id;
    if (editingId && !variants.some((variant) => variant.id === editingId)) {
      toastContext?.toast?.error?.(
        'Biến thể đã bị xóa ở nơi khác. Hãy tải lại danh sách.'
      );
      return false;
    }

    const timestamp = new Date().toISOString();
    const savedRows = rows.map((row) => {
      const original = editingVariant
        ? variants.find((variant) => variant.id === editingVariant.id)
        : variants.find((variant) => variant.id === row.id);
      return {
        ...original,
        ...row,
        id: original?.id ?? row.id ?? createVariantId(),
        productId: String(product.id),
        productName: product.name,
        sku: String(row.sku).trim(),
        color: {
          ...original?.color,
          ...row.color,
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
        image: row.image || product.images?.[0] || '',
        status: row.status,
        createdAt: original?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
    });
    const next = editingId
      ? variants.map((variant) =>
          variant.id === editingId ? savedRows[0] : variant
        )
      : [...savedRows, ...variants];
    if (!updateVariants(next)) {
      toastContext?.toast?.error?.(
        'Không thể lưu biến thể vào bộ nhớ trình duyệt. Hãy kiểm tra dung lượng lưu trữ.'
      );
      return false;
    }
    closeForm();
    setCurrentPage(1);
    setSelectedIds([]);
    toastContext?.toast?.success(
      editingId
        ? 'Đã cập nhật biến thể.'
        : `Đã thêm ${savedRows.length} biến thể.`
    );
    return true;
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const ids = new Set(
      deleteTarget
        .filter((target) => variants.some((item) => item.id === target.id))
        .map((variant) => variant.id)
    );
    if (!ids.size) {
      setDeleteTarget(null);
      toastContext?.toast?.error?.(
        'Các biến thể đã bị xóa ở nơi khác. Danh sách đã được cập nhật.'
      );
      return false;
    }
    if (!updateVariants(variants.filter((variant) => !ids.has(variant.id)))) {
      toastContext?.toast?.error?.(
        'Không thể xóa biến thể vì bộ nhớ trình duyệt không khả dụng.'
      );
      return false;
    }
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
    return true;
  }

  function requestDelete(variant) {
    if (variants.some((item) => item.id === variant.id)) {
      setDeleteTarget([variant]);
    }
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
    setCurrentPage(Math.max(1, visiblePage - 1));
  }

  function goToNextPage() {
    setCurrentPage(Math.min(pageCount, visiblePage + 1));
  }

  return {
    variants,
    ready,
    filters,
    colors,
    sizes,
    stats,
    variantCounts,
    selectedCount,
    filteredVariants,
    pageVariants,
    currentPage: visiblePage,
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
