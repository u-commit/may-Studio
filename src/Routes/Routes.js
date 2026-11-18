import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('@components/HomePage/HomePage')),
  },
  {
    path: '/shop',
    component: lazy(() => import('@components/ShopPage/ShopPage')),
  },
  {
    path: '/product/:productId',
    component: lazy(() => import('@components/ProductDetailPage/ProductDetailPage')),
  },
  {
    path: '/user',
    component: lazy(() => import('@components/HomePage/HomePage')),
    role: 'user',
  },
  {
    path: '/blog',
    component: lazy(() => import('@components/Blog/Blog')),
  },
  {
    path: '/admin',
    component: lazy(() => import('@components/AdminPage/AdminPage')),
    role: 'admin',
  },
];
export default routes;
