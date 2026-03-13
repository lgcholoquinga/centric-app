import type { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./client-management'),
    children: [
      {
        path: 'create',
        loadComponent: () => import('./pages/create-client/create-client'),
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list-client/list-client'),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
    ],
  },
] as Routes;
