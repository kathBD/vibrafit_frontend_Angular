import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardClientComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
