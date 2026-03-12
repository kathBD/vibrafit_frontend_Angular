import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  if (rolesPermitidos.includes(auth.rolNormalizado())) return true;
  auth.redirectByRole();
  return false;
};
