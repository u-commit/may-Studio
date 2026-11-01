import { FiBox, FiGrid, FiLayers, FiUsers } from 'react-icons/fi';
import { CUSTOMER_STORAGE_KEY } from '../../utils/customerStore';

export const STORAGE_KEYS = {
  products: 'may-studio-admin-products',
  customers: CUSTOMER_STORAGE_KEY,
  catalog: 'may-studio-admin-catalog',
};

export const ADMIN_NAV_ITEMS = [
  { id: 'overview', label: 'Tổng quan', icon: FiGrid },
  { id: 'products', label: 'Sản phẩm', icon: FiBox },
  { id: 'catalog', label: 'Danh mục', icon: FiLayers },
  { id: 'customers', label: 'Khách hàng', icon: FiUsers },
];

export const CATALOG_LABELS = {
  categories: 'Loại sản phẩm',
  manufacturers: 'Nhà sản xuất',
  colors: 'Màu sắc',
  sizes: 'Kích cỡ',
};

export const INITIAL_PRODUCTS = [
  {
    id: 'SP-001',
    name: 'Áo sơ mi linen An Nhiên',
    description: 'Chất linen mềm, thoáng mát, phù hợp mặc hằng ngày.',
    images: [],
    category: 'Áo',
    manufacturer: 'MÂY Atelier',
    color: 'Trắng kem',
    sizes: ['S', 'M', 'L'],
    price: 690000,
    stock: 24,
  },
  {
    id: 'SP-002',
    name: 'Váy midi Hoa Nắng',
    description: 'Dáng midi nữ tính với chất vải nhẹ và rủ tự nhiên.',
    images: [],
    category: 'Váy',
    manufacturer: 'MÂY Atelier',
    color: 'Vàng bơ',
    sizes: ['S', 'M'],
    price: 1250000,
    stock: 8,
  },
  {
    id: 'SP-003',
    name: 'Áo cardigan Sương Mai',
    description: 'Cardigan mềm nhẹ cho những ngày thời tiết dịu mát.',
    images: [],
    category: 'Áo',
    manufacturer: 'Nhà Mây',
    color: 'Xanh sage',
    sizes: ['M', 'L'],
    price: 980000,
    stock: 3,
  },
];

export const INITIAL_CUSTOMERS = [];

export const INITIAL_CATALOG = {
  categories: ['Áo', 'Váy', 'Quần', 'Phụ kiện'],
  manufacturers: ['MÂY Atelier', 'Nhà Mây'],
  manufacturerDetails: {
    'MÂY Atelier': {
      description: 'Thương hiệu thiết kế thời trang nữ.',
      logoUrl: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    },
    'Nhà Mây': {
      description: 'Đối tác sản xuất và phụ kiện thủ công.',
      logoUrl: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    },
  },
  colors: ['Trắng kem', 'Vàng bơ', 'Nâu đất', 'Xanh sage', 'Đen'],
  sizes: ['S', 'M', 'L', 'XL', 'Freesize'],
};

export const BLANK_PRODUCT = {
  name: '',
  description: '',
  imagesText: '',
  category: '',
  manufacturer: '',
  color: '',
  sizes: [],
  price: '',
  stock: '',
};

export const PRODUCT_FIELD_BY_CATALOG = {
  categories: 'category',
  manufacturers: 'manufacturer',
  colors: 'color',
  sizes: 'sizes',
};
