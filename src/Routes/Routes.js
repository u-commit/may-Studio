import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('@components/HomePage/HomePage')),
  },
  {
    path: '/blog',
    component: lazy(() => import('@components/Blog/Blog')),
  },
];
export default routes;
