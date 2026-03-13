import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-admin.component')
      .then(m => m.DashboardAdminComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/user-management/user-management.component')
      .then(m => m.UserManagementComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
