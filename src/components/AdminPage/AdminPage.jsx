import { useEffect, useState } from 'react';
import { getProduct } from '../../apis/productsService';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import CatalogManager from './CatalogManager/CatalogManager';
import CustomerList from './CustomerList/CustomerList';
import ProductForm from './ProductForm/ProductForm';
import ProductList from './ProductList/ProductList';
import styles from './styles.module.scss';
import {
  BLANK_PRODUCT,
  INITIAL_CATALOG,
  INITIAL_CUSTOMERS,
  PRODUCT_FIELD_BY_CATALOG,
  STORAGE_KEYS,
} from './constants';
import { mergeProductCatalog, normalizeProductList } from './productAdapter';
import { CUSTOMERS_UPDATED_EVENT } from '../../utils/customerStore';
import { applyProductChanges, deleteProductChange, saveProductChange } from '../../utils/productStore';

function readSaved(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [productsReload, setProductsReload] = useState(0);
  const [customers, setCustomers] = useState(() =>
    readSaved(STORAGE_KEYS.customers, INITIAL_CUSTOMERS)
  );
  const [catalog, setCatalog] = useState(() => {
    const saved = readSaved(STORAGE_KEYS.catalog, INITIAL_CATALOG);
    return {
      ...INITIAL_CATALOG,
      ...saved,
      manufacturerDetails: {
        ...INITIAL_CATALOG.manufacturerDetails,
        ...(saved.manufacturerDetails ?? {}),
      },
    };
  });
  const [page, setPage] = useState('overview');
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setProductsLoading(true);
    setProductsError('');

    // Omitting limit asks the product API for its full list, as documented by the endpoint.
    getProduct({ sortType: 0 })
      .then((response) => {
        const apiProducts = applyProductChanges(normalizeProductList(response));
        if (!isMounted) return;
        setProducts(apiProducts);
        setCatalog((current) => mergeProductCatalog(current, apiProducts));
      })
      .catch((error) => {
        if (!isMounted) return;
        setProductsError(error.response?.data?.message || error.message || 'Không tải được sản phẩm từ API.');
      })
      .finally(() => {
        if (isMounted) setProductsLoading(false);
      });

    return () => { isMounted = false; };
  }, [productsReload]);
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.customers,
      JSON.stringify(customers)
    );
  }, [customers]);
  useEffect(() => {
    const reloadCustomers = () => {
      setCustomers(readSaved(STORAGE_KEYS.customers, INITIAL_CUSTOMERS));
    };
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEYS.customers) reloadCustomers();
    };
    window.addEventListener(CUSTOMERS_UPDATED_EVENT, reloadCustomers);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CUSTOMERS_UPDATED_EVENT, reloadCustomers);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalog));
  }, [catalog]);

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

  function saveProduct(event) {
    event.preventDefault();
    if (form.sizes.length === 0) {
      window.alert('Hãy chọn ít nhất một kích cỡ.');
      return;
    }
    const { imagesText, ...productFields } = form;
    const images = imagesText.split(',').map((url) => url.trim()).filter(Boolean);
    const product = {
      ...productFields,
      id: editingId ?? `SP-${Date.now()}`,
      images,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    saveProductChange(product, { isNew: !editingId });
    setProducts((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? product : item))
        : [product, ...current]
    );
    closeProductForm();
  }

  function closeProductForm() {
    setForm(BLANK_PRODUCT);
    setEditingId(null);
    setFormOpen(false);
  }

  function deleteProduct(id) {
    const product = products.find((item) => item.id === id);
    if (product && window.confirm(`Xóa sản phẩm “${product.name}”?`)) {
      deleteProductChange(id);
      setProducts((current) => current.filter((item) => item.id !== id));
    }
  }

  function addCatalogItem(type, rawValue) {
    const value = rawValue.trim();
    if (!value) return;
    setCatalog((current) => {
      if (current[type].some((item) => item.toLowerCase() === value.toLowerCase())) return current;
      const next = { ...current, [type]: [...current[type], value] };
      if (type === 'manufacturers') {
        next.manufacturerDetails = {
          ...(current.manufacturerDetails ?? {}),
          [value]: { description: '', logoUrl: '', contactName: '', phone: '', email: '', address: '' },
        };
      }
      return next;
    });
  }

  function renameCatalogItem(type, oldValue, newValueInput) {
    const newValue = newValueInput.trim();
    if (!newValue || oldValue === newValue) return;
    if (
      catalog[type].some(
        (item) => item.toLowerCase() === newValue.toLowerCase()
      )
    ) {
      window.alert('Tên này đã có trong danh mục.');
      return;
    }
    setCatalog((current) => {
      const next = {
        ...current,
        [type]: current[type].map((item) => item === oldValue ? newValue : item),
      };
      if (type === 'manufacturers') {
        const manufacturerDetails = { ...(current.manufacturerDetails ?? {}) };
        manufacturerDetails[newValue] = manufacturerDetails[oldValue] ?? {};
        delete manufacturerDetails[oldValue];
        next.manufacturerDetails = manufacturerDetails;
      }
      return next;
    });
    const field = PRODUCT_FIELD_BY_CATALOG[type];
    const updatedProducts = products.map((product) => {
      if (field === 'sizes') {
        if (!product.sizes.includes(oldValue)) return product;
        return {
          ...product,
          sizes: product.sizes.map((size) => size === oldValue ? newValue : size),
        };
      }
      return product[field] === oldValue ? { ...product, [field]: newValue } : product;
    });
    setProducts(updatedProducts);
    updatedProducts.forEach((product, index) => {
      if (product !== products[index]) saveProductChange(product);
    });
  }

  function deleteCatalogItem(type, value) {
    const field = PRODUCT_FIELD_BY_CATALOG[type];
    const isUsed = products.some((product) =>
      field === 'sizes'
        ? product.sizes.includes(value)
        : product[field] === value
    );
    if (isUsed) {
      window.alert(
        'Có sản phẩm đang dùng mục này. Hãy sửa sản phẩm trước khi xóa.'
      );
      return;
    }
    setCatalog((current) => {
      const next = { ...current, [type]: current[type].filter((item) => item !== value) };
      if (type === 'manufacturers') {
        const manufacturerDetails = { ...(current.manufacturerDetails ?? {}) };
        delete manufacturerDetails[value];
        next.manufacturerDetails = manufacturerDetails;
      }
      return next;
    });
  }

  function saveManufacturerDetails(name, details) {
    setCatalog((current) => ({
      ...current,
      manufacturerDetails: {
        ...(current.manufacturerDetails ?? {}),
        [name]: details,
      },
    }));
  }

  function toggleCustomer(id) {
    const customer = customers.find((item) => item.id === id);
    if (!customer) return;
    if (
      customer.active &&
      !window.confirm(`Đóng tài khoản của ${customer.name}?`)
    )
      return;
    setCustomers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  }

  const pageTitle = {
    overview: 'Tổng quan',
    products: 'Sản phẩm',
    catalog: 'Danh mục',
    customers: 'Khách hàng',
  }[page];

  return (
    <div className={styles.adminShell}>
      <AdminSidebar activePage={page} onNavigate={setPage} />
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <span>
            Quản trị / <strong>{pageTitle}</strong>
          </span>
          <a href='/'>Quay lại cửa hàng</a>
        </header>
        <div className={styles.pageContent}>
          <div className={styles.pageHeading}>
            <div>
              <span className={styles.eyebrow}>MÂY STUDIO · QUẢN TRỊ</span>
              <h1>{pageTitle}</h1>
              <p>Quản lý sản phẩm, danh mục và tài khoản khách hàng.</p>
            </div>
            {page === 'products' && (
              <button
                className={styles.primaryButton}
                type='button'
                onClick={startAddProduct}
              >
                + Thêm sản phẩm
              </button>
            )}
          </div>

          {(page === 'products' || page === 'catalog') && (productsLoading || productsError) && (
            <div className={styles.apiNotice} role={productsError ? 'alert' : 'status'}>
              <span>{productsError ? `Không tải được sản phẩm từ API: ${productsError}` : 'Đang tải dữ liệu sản phẩm từ API...'}</span>
              {productsError && <button className={styles.secondaryButton} type="button" onClick={() => setProductsReload((current) => current + 1)}>Thử lại</button>}
            </div>
          )}

          {page === 'overview' && (
            <div className={styles.metricGrid}>
              <Metric title='Tổng sản phẩm' value={products.length} />
              <Metric
                title='Khách hàng hoạt động'
                value={customers.filter((customer) => customer.active).length}
              />
              <Metric
                title='Sản phẩm cần nhập'
                value={
                  products.filter((product) => Number(product.stock) < 5).length
                }
              />
              <button
                className={styles.metricCard}
                type='button'
                onClick={startAddProduct}
              >
                <span>Thao tác nhanh</span>
                <strong>+ Thêm sản phẩm</strong>
              </button>
            </div>
          )}

          {page === 'products' && (
            <>
              {formOpen && (
                <ProductForm
                  form={form}
                  catalog={catalog}
                  editing={Boolean(editingId)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [event.target.name]: event.target.value,
                    }))
                  }
                  onToggleSize={(size) =>
                    setForm((current) => ({
                      ...current,
                      sizes: current.sizes.includes(size)
                        ? current.sizes.filter((item) => item !== size)
                        : [...current.sizes, size],
                    }))
                  }
                  onSubmit={saveProduct}
                  onCancel={closeProductForm}
                />
              )}
              <ProductList
                products={products}
                categories={catalog.categories}
                loading={productsLoading}
                loadError={productsError}
                onEdit={editProduct}
                onDelete={deleteProduct}
              />
            </>
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

function Metric({ title, value }) {
  return (
    <div className={styles.metricCard}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>Cập nhật theo dữ liệu hiện có</small>
    </div>
  );
}

export default AdminPage;
