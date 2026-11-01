import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('@components/HomePage/HomePage')),
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
