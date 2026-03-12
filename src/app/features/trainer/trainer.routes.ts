import { Routes } from '@angular/router';

export const TRAINER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardTrainerComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
