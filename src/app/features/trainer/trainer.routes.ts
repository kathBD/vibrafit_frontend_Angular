import { Routes } from '@angular/router';

export const TRAINER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-trainer.component')
      .then(m => m.DashboardTrainerComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('../../shared/components/profile/profile.component')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/client-list/client-list')
      .then(m => m.ClientListComponent)
  },
  {
    path: 'buscar-cliente',
    loadComponent: () => import('./pages/client-search/client-search')
      .then(m => m.ClientSearch)
  },
 {
  path: 'rutinas',
  loadComponent: () => import('./pages/routines/routines.component')
    .then(m => m.RoutinesComponent)
},
{
  path: 'rutinas/nueva',
  loadComponent: () => import('./pages/routine-form/routine-form.component')
    .then(m => m.RoutineFormComponent)
},
{
  path: 'rutinas/editar/:id',
  loadComponent: () => import('./pages/routine-form/routine-form.component')
    .then(m => m.RoutineFormComponent)
},
{
  path: 'rutinas/detalle/:id',  
  loadComponent: () => import('./pages/routine-detail/routine-detail.component')
    .then(m => m.RoutineDetailComponent)
},
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/stats/stats')
      .then(m => m.Stats)
  },
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendar/calendar')
      .then(m => m.Calendar)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reports/reports')
      .then(m => m.Reports)
  },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  }
];