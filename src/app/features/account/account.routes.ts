import type { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./account-management'),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/create-account/create-account'),
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list-account/list-account'),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/edit-account/edit-account'),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
