import { useState } from 'react';
import { BLANK_PRODUCT } from '../constants';

function useProductForm({ catalog, onSaveProduct, setPage }) {
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  function startAddProduct() {
    setForm({
      ...BLANK_PRODUCT,
      category: catalog.categories[0] ?? '',
      manufacturer: catalog.manufacturers[0] ?? '',
      color: catalog.colors[0] ?? '',
    });

    setEditingId(null);
    setFormOpen(true);
    setPage('products');
  }

  function editProduct(product) {
    setForm({
      ...product,
      description: product.description ?? '',
      imagesText: (product.images ?? []).join(', '),
      price: String(product.price),
      stock: String(product.stock),
    });

    setEditingId(product.id);
    setFormOpen(true);
    setPage('products');
  }

  function closeProductForm() {
    setForm(BLANK_PRODUCT);
    setEditingId(null);
    setFormOpen(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleToggleSize(size) {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
  }

  function saveProduct(event) {
    event.preventDefault();

    if (form.sizes.length === 0) {
      window.alert('Hãy chọn ít nhất một kích cỡ.');
      return;
    }

    const { imagesText, ...productFields } = form;

    const images = imagesText
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const product = {
      ...productFields,
      id: editingId ?? `SP-${Date.now()}`,
      images,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    onSaveProduct(product, { isNew: !editingId });
    closeProductForm();
  }

  return {
    form,
    editingId,
    formOpen,
    startAddProduct,
    editProduct,
    closeProductForm,
    handleChange,
    handleToggleSize,
    saveProduct,
  };
}

export default useProductForm;
