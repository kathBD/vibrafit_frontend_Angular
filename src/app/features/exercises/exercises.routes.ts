import { Routes } from '@angular/router';

export const EXERCISES_ROUTES: Routes = [
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent)
  },
  { path: '', redirectTo: 'catalog', pathMatch: 'full' }
];
