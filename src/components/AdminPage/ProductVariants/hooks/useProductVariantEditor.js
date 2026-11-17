import { useEffect, useMemo, useState } from 'react';
import {
  deleteVariant as removeProductVariant,
  getProductVariants,
  saveProductVariants,
} from '../../../../apis/variantService';
import { validateVariants } from '../../../../utils/variantValidation';
import { getVariantSummary } from '../../../../utils/variantSummary';

const cloneRows = (items) =>
  items.map((item) => ({
    ...item,
    color: { ...(item.color ?? {}) },
    images: [...(item.images ?? (item.image ? [item.image] : []))],
  }));

function useProductVariantEditor({
  product,
  allVariants,
  products,
  onClose,
  onSaved,
}) {
  const [savedVariants, setSavedVariants] = useState([]);
  const [draftVariants, setDraftVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingVariant, setEditingVariant] = useState(null);
  const [headerVariantId, setHeaderVariantId] = useState(null);
  const [deletingVariant, setDeletingVariant] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    getProductVariants(product.id, product)
      .then((rows) => {
        if (!active) return;
        const next = cloneRows(rows);
        setSavedVariants(next);
        setDraftVariants(next);
        setFieldErrors({});
      })
      .catch((error) => {
        if (active)
          setLoadError(error.message || 'Không tải được danh sách biến thể.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [product, revision]);

  const summary = useMemo(
    () => getVariantSummary(draftVariants),
    [draftVariants]
  );
  const filteredVariants = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return draftVariants.filter((variant) => {
      const searchable =
        `${variant.sku ?? ''} ${variant.color?.name ?? ''} ${variant.size ?? ''}`.toLocaleLowerCase(
          'vi'
        );
      const isActive = Boolean(variant.isActive ?? variant.status === 'active');
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (statusFilter === 'all' ||
          (statusFilter === 'active' && isActive) ||
          (statusFilter === 'inactive' && !isActive))
      );
    });
  }, [draftVariants, query, statusFilter]);
  const hasChanges =
    JSON.stringify(savedVariants) !== JSON.stringify(draftVariants);
  const headerImage =
    draftVariants.find((item) => item.id === headerVariantId)?.images?.[0] ??
    product.images?.[0] ??
    '';

  function addVariants(variants) {
    const next = [
      ...draftVariants,
      ...variants.map((variant) => ({
        ...variant,
        productId: String(product.id),
        productName: product.name,
        image: variant.images?.[0] ?? '',
      })),
    ];
    setDraftVariants(next);
    setFieldErrors(
      validateVariants(
        next,
        allVariants.filter(
          (item) => String(item.productId) !== String(product.id)
        ),
        product.id
      )
    );
  }

  function saveEditedVariant(variant) {
    setDraftVariants((current) =>
      current.map((item) =>
        item.id === variant.id
          ? { ...variant, image: variant.images?.[0] ?? '' }
          : item
      )
    );
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[variant.id];
      return next;
    });
    setHeaderVariantId(variant.id);
    setEditingVariant(null);
  }

  function openEditVariant(variant) {
    setHeaderVariantId(variant.id);
    setEditingVariant(variant);
  }

  function cancelEditVariant() {
    setHeaderVariantId(null);
    setEditingVariant(null);
  }

  function requestDelete(variant) {
    setDeleteError('');
    setDeletingVariant(variant);
  }

  function cancelDelete() {
    if (deleting) return;
    setDeleteError('');
    setDeletingVariant(null);
  }

  async function confirmDelete() {
    if (!deletingVariant || deleting) return false;
    const target = deletingVariant;
    const isSaved = savedVariants.some(
      (item) => String(item.id) === String(target.id)
    );
    setDeleteError('');

    if (isSaved) {
      setDeleting(true);
      try {
        await removeProductVariant(product.id, target.id, products);
        setSavedVariants((current) =>
          current.filter((item) => String(item.id) !== String(target.id))
        );
        onSaved?.();
      } catch (error) {
        setDeleteError(error.message || 'Không xóa được loại sản phẩm.');
        return false;
      } finally {
        setDeleting(false);
      }
    }

    const remainingVariants = draftVariants.filter(
      (item) => String(item.id) !== String(target.id)
    );
    setDraftVariants(remainingVariants);
    setFieldErrors(
      validateVariants(
        remainingVariants,
        allVariants.filter(
          (item) => String(item.productId) !== String(product.id)
        ),
        product.id
      )
    );
    if (headerVariantId === deletingVariant.id) setHeaderVariantId(null);
    setDeletingVariant(null);
    return true;
  }

  async function saveChanges() {
    const errors = validateVariants(
      draftVariants,
      allVariants.filter(
        (item) => String(item.productId) !== String(product.id)
      ),
      product.id
    );
    setFieldErrors(errors);
    if (Object.keys(errors).length) return false;
    setSaving(true);
    setSaveError('');
    try {
      const saved = await saveProductVariants(
        product.id,
        draftVariants,
        products
      );
      const next = cloneRows(saved);
      setSavedVariants(next);
      setDraftVariants(next);
      onSaved?.();
      onClose?.();
      return true;
    } catch (error) {
      if (error.fieldErrors) setFieldErrors(error.fieldErrors);
      else setSaveError(error.message || 'Không lưu được thay đổi.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function retry() {
    setLoading(true);
    setLoadError('');
    setRevision((current) => current + 1);
  }

  return {
    savedVariants,
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
    headerImage,
    deletingVariant,
    deleting,
    deleteError,
    hasChanges,
    setQuery,
    setStatusFilter,
    addVariants,
    retry,
    editVariant: openEditVariant,
    cancelEditVariant,
    deleteVariant: requestDelete,
    cancelDelete,
    saveEditedVariant,
    confirmDelete,
    saveChanges,
  };
}

export default useProductVariantEditor;
