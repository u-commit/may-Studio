import { useRef, useState } from 'react';
import { BLANK_PRODUCT } from '../constants';

const MAX_PRODUCT_UPLOADS = 4;
const MAX_PRODUCT_IMAGE_BYTES = 512 * 1024;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Không đọc được ảnh đã chọn.'));
    reader.readAsDataURL(file);
  });
}

function useProductForm({ catalog, onSaveProduct, setPage }) {
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const uploadGeneration = useRef(0);

  function startAddProduct() {
    uploadGeneration.current += 1;
    setImageUploading(false);
    setForm({
      ...BLANK_PRODUCT,
      category: catalog.categories[0] ?? '',
      manufacturer: catalog.manufacturers[0] ?? '',
      color: catalog.colors[0] ?? '',
    });

    setEditingId(null);
    setFormOpen(true);
    setImageError('');
    setPage('products');
  }

  function editProduct(product) {
    uploadGeneration.current += 1;
    setImageUploading(false);
    setForm({
      ...product,
      description: product.description ?? '',
      images: [...(product.images ?? [])],
      uploadedImages: [],
      price: String(product.price),
      stock: String(product.stock),
    });

    setEditingId(product.id);
    setFormOpen(true);
    setImageError('');
    setPage('products');
  }

  function closeProductForm() {
    uploadGeneration.current += 1;
    setForm(BLANK_PRODUCT);
    setEditingId(null);
    setFormOpen(false);
    setImageError('');
    setImageUploading(false);
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

  async function addProductImages(event) {
    const files = [...(event.currentTarget.files ?? [])];
    event.currentTarget.value = '';
    setImageError('');
    if (!files.length) return;

    if (files.some((file) => !file.type.startsWith('image/'))) {
      setImageError('Chỉ chọn tệp hình ảnh.');
      return;
    }
    if (files.some((file) => file.size > MAX_PRODUCT_IMAGE_BYTES)) {
      setImageError('Mỗi ảnh không được vượt quá 512 KB.');
      return;
    }
    if ((form.uploadedImages?.length ?? 0) + files.length > MAX_PRODUCT_UPLOADS) {
      setImageError(`Mỗi sản phẩm được tải lên tối đa ${MAX_PRODUCT_UPLOADS} ảnh.`);
      return;
    }

    const generation = ++uploadGeneration.current;
    setImageUploading(true);
    try {
      const images = await Promise.all(files.map(readImage));
      if (generation !== uploadGeneration.current) return;
      setForm((current) => ({
        ...current,
        uploadedImages: [...(current.uploadedImages ?? []), ...images],
      }));
    } catch (error) {
      if (generation === uploadGeneration.current)
        setImageError(error.message || 'Không đọc được ảnh đã chọn.');
    } finally {
      if (generation === uploadGeneration.current) setImageUploading(false);
    }
  }

  function removeProductImage(source, imageIndex) {
    setForm((current) =>
      source === 'uploaded'
        ? {
            ...current,
            uploadedImages: (current.uploadedImages ?? []).filter(
              (_, index) => index !== imageIndex
            ),
          }
        : {
            ...current,
            images: (current.images ?? []).filter(
              (_, index) => index !== imageIndex
            ),
          }
    );
  }

  function saveProduct(event) {
    event.preventDefault();
    if (imageUploading) return;

    if (form.sizes.length === 0) {
      window.alert('Hãy chọn ít nhất một kích cỡ.');
      return;
    }

    const { images: currentImages, uploadedImages, ...productFields } = form;
    const images = [...new Set([...(currentImages ?? []), ...(uploadedImages ?? [])])];

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
    addProductImages,
    removeProductImage,
    imageUploading,
    imageError,
    saveProduct,
  };
}

export default useProductForm;
