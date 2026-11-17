import { useState } from 'react';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import CatalogManager from './CatalogManager/CatalogManager';
import CustomerList from './CustomerList/CustomerList';
import useAdminData from './hooks/useAdminData';
import useAdminCustomers from './hooks/useAdminCustomers';
import useProductForm from './hooks/useProductForm';
import AdminHeader from './AdminHeader/AdminHeader';
import styles from './styles.module.scss';
import PageHeading from './PageHeading/PageHeading';
import OverviewDashboard from './OverviewDashboard/OverviewDashboard';
import ProductsSection from './ProductsSection/ProductsSection';
import ProductVariants from './ProductVariants/ProductVariants';
import useVariantCatalog from './ProductVariants/hooks/useVariantCatalog';

function AdminPage() {
  const [page, setPage] = useState('overview');
  const [variantProduct, setVariantProduct] = useState(null);

  const {
    products,
    productsLoading,
    productsError,
    reloadProducts,
    catalog,
    saveProduct,
    deleteProduct,
    addCatalogItem,
    renameCatalogItem,
    deleteCatalogItem,
    saveManufacturerDetails,
  } = useAdminData();

  const { customers, toggleCustomer } = useAdminCustomers();
  const variantCatalog = useVariantCatalog(products, productsLoading);

  const {
    form,
    editingId,
    formOpen,
    startAddProduct,
    editProduct,
    closeProductForm,
    handleChange,
    handleToggleSize,
    saveProduct: handleSaveProduct,
  } = useProductForm({
    catalog,
    onSaveProduct: saveProduct,
    setPage,
  });

  const pageTitle = {
    overview: 'Tổng quan',
    products: 'Sản phẩm',
    catalog: 'Danh mục',
    customers: 'Khách hàng',
  }[page];

  const { adminShell, mainContent, pageContent } = styles;

  return (
    <div className={adminShell}>
      <AdminSidebar activePage={page} onNavigate={setPage} />

      <main className={mainContent}>
        <AdminHeader pageTitle={pageTitle} />
        <div className={pageContent}>
          <PageHeading
            pageTitle={pageTitle}
            showAddProduct={page === 'products'}
            onAddProduct={startAddProduct}
          />

          {(page === 'products' || page === 'catalog') &&
            (productsLoading || productsError) && (
              <div
                className={styles.apiNotice}
                role={productsError ? 'alert' : 'status'}
              >
                <span>
                  {productsError
                    ? `Không tải được sản phẩm từ API: ${productsError}`
                    : 'Đang tải dữ liệu sản phẩm từ API...'}
                </span>

                {productsError && (
                  <button
                    className={styles.secondaryButton}
                    type='button'
                    onClick={reloadProducts}
                  >
                    Thử lại
                  </button>
                )}
              </div>
            )}

          {page === 'overview' && (
            <OverviewDashboard
              products={products}
              customers={customers}
              onAddProduct={startAddProduct}
            />
          )}
          {page === 'products' && (
            <ProductsSection
              products={products}
              catalog={catalog}
              variantSummaries={variantCatalog.summaries}
              variantsLoading={variantCatalog.loading}
              productsLoading={productsLoading}
              productsError={productsError}
              form={form}
              formOpen={formOpen}
              editing={Boolean(editingId)}
              onChange={handleChange}
              onToggleSize={handleToggleSize}
              onSubmit={handleSaveProduct}
              onCancel={closeProductForm}
              onEdit={editProduct}
              onDelete={deleteProduct}
              onManageVariants={setVariantProduct}
            />
          )}
          {variantProduct && (
            <ProductVariants
              key={variantProduct.id}
              product={variantProduct}
              products={products}
              catalog={catalog}
              allVariants={variantCatalog.variants}
              onClose={() => setVariantProduct(null)}
              onSaved={variantCatalog.retry}
            />
          )}
          {page === 'catalog' && (
            <CatalogManager
              catalog={catalog}
              products={products}
              productsLoading={productsLoading}
              productsError={productsError}
              onAdd={addCatalogItem}
              onRename={renameCatalogItem}
              onDelete={deleteCatalogItem}
              onSaveManufacturerDetails={saveManufacturerDetails}
            />
          )}
          {page === 'customers' && (
            <CustomerList customers={customers} onToggle={toggleCustomer} />
          )}
        </div>
      </main>
    </div>
  );
}
export default AdminPage;
