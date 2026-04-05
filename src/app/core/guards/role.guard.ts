import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // 1. Si no hay sesión, al login
  if (!auth.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // 2. Extraemos los roles (el original y el normalizado por si acaso)
  const rolExacto = auth.userRole();
  const rolNormalizado = auth.rolNormalizado();

  // 3. Verificamos si alguno de los dos coincide
  if (rolesPermitidos.includes(rolExacto!) || rolesPermitidos.includes(rolNormalizado)) {
    return true;
  }

  // 4. 🔥 CORTAMOS EL BUCLE AQUÍ 🔥
  // Si el rol no coincide, NO lo redirigimos por rol de nuevo. Lo mandamos al "Home" o a la raíz.
  router.navigate(['/']);
  return false;
};
