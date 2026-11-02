import { useEffect, useState } from 'react';
import { getProduct } from '../../../apis/productsService';
import {
  INITIAL_CATALOG,
  PRODUCT_FIELD_BY_CATALOG,
  STORAGE_KEYS,
} from '../constants';
import { mergeProductCatalog, normalizeProductList } from '../productAdapter';
import {
  applyProductChanges,
  deleteProductChange,
  saveProductChange,
} from '../../../utils/productStore';

function readSaved(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function useAdminData() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [productsReload, setProductsReload] = useState(0);

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

  useEffect(() => {
    let isMounted = true;

    setProductsLoading(true);
    setProductsError('');

    getProduct({ sortType: 0 })
      .then((response) => {
        const apiProducts = applyProductChanges(normalizeProductList(response));

        if (!isMounted) return;

        setProducts(apiProducts);
        setCatalog((current) => mergeProductCatalog(current, apiProducts));
      })
      .catch((error) => {
        if (!isMounted) return;

        setProductsError(
          error.response?.data?.message ||
            error.message ||
            'Không tải được sản phẩm từ API.'
        );
      })
      .finally(() => {
        if (isMounted) {
          setProductsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productsReload]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(catalog));
  }, [catalog]);

  function reloadProducts() {
    setProductsReload((current) => current + 1);
  }

  function saveProduct(product, { isNew }) {
    saveProductChange(product, { isNew });

    setProducts((current) =>
      isNew
        ? [product, ...current]
        : current.map((item) => (item.id === product.id ? product : item))
    );
  }

  function deleteProduct(id) {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    if (window.confirm(`Xóa sản phẩm “${product.name}”?`)) {
      deleteProductChange(id);
      setProducts((current) => current.filter((item) => item.id !== id));
    }
  }

  function addCatalogItem(type, rawValue) {
    const value = rawValue.trim();
    if (!value) return;

    setCatalog((current) => {
      if (
        current[type].some((item) => item.toLowerCase() === value.toLowerCase())
      ) {
        return current;
      }

      const next = {
        ...current,
        [type]: [...current[type], value],
      };

      if (type === 'manufacturers') {
        next.manufacturerDetails = {
          ...(current.manufacturerDetails ?? {}),
          [value]: {
            description: '',
            logoUrl: '',
            contactName: '',
            phone: '',
            email: '',
            address: '',
          },
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
        [type]: current[type].map((item) =>
          item === oldValue ? newValue : item
        ),
      };

      if (type === 'manufacturers') {
        const manufacturerDetails = {
          ...(current.manufacturerDetails ?? {}),
        };

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
          sizes: product.sizes.map((size) =>
            size === oldValue ? newValue : size
          ),
        };
      }

      return product[field] === oldValue
        ? { ...product, [field]: newValue }
        : product;
    });

    setProducts(updatedProducts);

    updatedProducts.forEach((product, index) => {
      if (product !== products[index]) {
        saveProductChange(product);
      }
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
      const next = {
        ...current,
        [type]: current[type].filter((item) => item !== value),
      };

      if (type === 'manufacturers') {
        const manufacturerDetails = {
          ...(current.manufacturerDetails ?? {}),
        };

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

  return {
    products,
    setProducts,
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
  };
}

export default useAdminData;
