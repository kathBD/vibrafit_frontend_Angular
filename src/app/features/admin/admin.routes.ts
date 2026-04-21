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
  {
    path: 'perfil',
    loadComponent: () => import('../../shared/components/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  { path: 'rutinas', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'notificaciones', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'membresias', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
