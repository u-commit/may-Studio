import ProductForm from '../ProductForm/ProductForm';
import ProductList from '../ProductList/ProductList';
function ProductsSection({
  products,
  catalog,
  productsLoading,
  productsError,
  form,
  formOpen,
  editing,
  onChange,
  onToggleSize,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
}) {
  if (formOpen) {
    return (
      <ProductForm
        form={form}
        catalog={catalog}
        editing={editing}
        onChange={onChange}
        onToggleSize={onToggleSize}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ProductList
      products={products}
      categories={catalog.categories}
      loading={productsLoading}
      loadError={productsError}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
export default ProductsSection;
