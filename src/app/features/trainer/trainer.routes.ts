// src/app/features/trainer/trainer.routes.ts
import { Routes } from '@angular/router';
import { DashboardTrainerComponent } from './pages/dashboard/dashboard-trainer.component';

export const TRAINER_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardTrainerComponent
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/client-list/client-list').then(m => m.ClientListComponent)
  },
  {
    path: 'rutinas',
    loadComponent: () => import('./pages/routines/routines').then(m => m.Routines)
  },
  {
    path: 'rutinas/nueva',
    loadComponent: () => import('./pages/routine-form/routine-form').then(m => m.RoutineForm)
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/stats/stats').then(m => m.Stats)
  },
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendar/calendar').then(m => m.Calendar)
  },
  {
    path: 'clientes/buscar',
    loadComponent: () => import('./pages/client-search/client-search').then(m => m.ClientSearch)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reports/reports').then(m => m.Reports)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
