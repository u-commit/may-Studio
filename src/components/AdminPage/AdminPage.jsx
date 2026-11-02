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
import MainLayout from '@components/Layout/Layout';
import Button from '@components/Button/Button.jsx';

function AdminPage() {
  const [page, setPage] = useState('overview');

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

  const { adminShell, mainContent, pageContent, apiNotice, retryButton } =
    styles;

  return (
    <div className={adminShell}>
      <AdminSidebar activePage={page} onNavigate={setPage} />

      <div className={mainContent}>
        <AdminHeader pageTitle={pageTitle} />

        <MainLayout>
          <div className={pageContent}>
            <PageHeading
              pageTitle={pageTitle}
              showAddProduct={page === 'products'}
              onAddProduct={startAddProduct}
            />

            {(page === 'products' || page === 'catalog') &&
              (productsLoading || productsError) && (
                <div
                  className={apiNotice}
                  role={productsError ? 'alert' : 'status'}
                >
                  <span>
                    {productsError
                      ? `Không tải được sản phẩm từ API: ${productsError}`
                      : 'Đang tải dữ liệu sản phẩm từ API...'}
                  </span>

                  {productsError && (
                    <Button
                      className={retryButton}
                      isPrimary={false}
                      type='button'
                      onClick={reloadProducts}
                      content='Thử lại'
                    />
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
        </MainLayout>
      </div>
    </div>
  );
}
export default AdminPage;
