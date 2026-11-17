import { useEffect, useMemo, useState } from 'react';
import {
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

  function changeVariant(id, field, value) {
    const next = draftVariants.map((item) => {
      if (item.id !== id) return item;
      const updated =
        field === 'color'
          ? { ...item, color: { ...item.color, name: value } }
          : { ...item, [field]: value };
      if (field === 'isActive') updated.status = value ? 'active' : 'inactive';
      return updated;
    });
    setDraftVariants(next);
    setFieldErrors(validateVariants(next, allVariants, product.id));
  }

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
    setFieldErrors(validateVariants(next, allVariants, product.id));
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

  function confirmDelete() {
    if (!deletingVariant) return;
    setDraftVariants((current) =>
      current.filter((item) => item.id !== deletingVariant.id)
    );
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[deletingVariant.id];
      return next;
    });
    if (headerVariantId === deletingVariant.id) setHeaderVariantId(null);
    setDeletingVariant(null);
  }

  async function saveChanges() {
    const errors = validateVariants(draftVariants, allVariants, product.id);
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
    hasChanges,
    setQuery,
    setStatusFilter,
    changeVariant,
    addVariants,
    retry,
    editVariant: openEditVariant,
    cancelEditVariant,
    deleteVariant: setDeletingVariant,
    saveEditedVariant,
    confirmDelete,
    saveChanges,
  };
}

export default useProductVariantEditor;
