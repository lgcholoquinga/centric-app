import type { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./movement-management'),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/create-movement/create-movement'),
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list-movement/list-movement'),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
