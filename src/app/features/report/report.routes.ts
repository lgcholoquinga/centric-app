import type { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./report-management'),
    children: [
      {
        path: 'movements',
        loadComponent: () => import('./pages/movement-report/movement-report'),
      },
      {
        path: '',
        redirectTo: 'movements',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
