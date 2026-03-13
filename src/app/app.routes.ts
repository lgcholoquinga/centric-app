import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/layout/dashboard/dashboard'),
    children: [
      {
        path: '',
        redirectTo: 'client',
        pathMatch: 'full',
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account.routes'),
      },
      {
        path: 'client',
        loadChildren: () => import('./features/client/client.routes'),
      },
    ],
  },
];
