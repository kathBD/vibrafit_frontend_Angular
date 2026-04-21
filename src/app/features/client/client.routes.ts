import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-client.component')
      .then(m => m.DashboardClientComponent)
  },
  {
    path: 'my-routines',  
    loadComponent: () => import('./pages/my-routines/my-routines.component')
      .then(m => m.MyRoutinesComponent)
  },
   {
    path: 'perfil',
    loadComponent: () => import('../../shared/components/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
