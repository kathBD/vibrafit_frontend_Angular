import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    // Le decimos al guardia que acepte AMBAS palabras, así no hay forma de que falle
    canActivate: [authGuard, roleGuard(['ADMIN', 'ADMINISTRADOR'])], 
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'trainer',
    canActivate: [authGuard, roleGuard(['ENTRENADOR'])],
    loadChildren: () => import('./features/trainer/trainer.routes').then(m => m.TRAINER_ROUTES)
  },
  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['CLIENTE'])],
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: 'exercises',
    canActivate: [authGuard],
    loadChildren: () => import('./features/exercises/exercises.routes').then(m => m.EXERCISES_ROUTES)
  },
  { path: '**', redirectTo: '/auth/login' }
];
