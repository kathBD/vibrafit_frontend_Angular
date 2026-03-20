import { Routes } from '@angular/router';

export const EXERCISES_ROUTES: Routes = [
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/exercise-catalog.component')
      .then(m => m.ExerciseCatalogComponent)
  },
  {
    path: ':id',  // ← NUEVA RUTA PARA DETALLES
    loadComponent: () => import('./pages/exercise-detail/exercise-detail.component')
      .then(m => m.ExerciseDetailComponent)
  },
  { path: '', redirectTo: 'catalog', pathMatch: 'full' }
];
