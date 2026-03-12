import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-admin.component')
      .then(m => m.DashboardAdminComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
