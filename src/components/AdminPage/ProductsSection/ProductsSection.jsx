import ProductForm from '../ProductForm/ProductForm';
import ProductList from '../ProductList/ProductList';
function ProductsSection({
  products,
  catalog,
  variantSummaries,
  variantsLoading,
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
  onManageVariants,
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
      variantSummaries={variantSummaries}
      variantsLoading={variantsLoading}
      loading={productsLoading}
      loadError={productsError}
      onEdit={onEdit}
      onDelete={onDelete}
      onManageVariants={onManageVariants}
    />
  );
}
export default ProductsSection;
