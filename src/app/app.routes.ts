import { Routes } from '@angular/router';

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
<<<<<<< HEAD
    // Le decimos al guardia que acepte AMBAS palabras, así no hay forma de que falle
    canActivate: [authGuard, roleGuard(['ADMIN', 'ADMINISTRADOR'])], 
=======
>>>>>>> develop
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'trainer',
    loadChildren: () => import('./features/trainer/trainer.routes').then(m => m.TRAINER_ROUTES)
  },
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: 'exercises',
    loadChildren: () => import('./features/exercises/exercises.routes').then(m => m.EXERCISES_ROUTES)
  },
  { path: '**', redirectTo: '/auth/login' }
];
