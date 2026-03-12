import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-client.component')
      .then(m => m.DashboardClientComponent)
  }
];
