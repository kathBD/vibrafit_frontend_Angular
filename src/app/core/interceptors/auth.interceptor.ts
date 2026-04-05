import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Evitar SSR (Renderizado en servidor) que a veces rompe Netlify
  if (typeof window === 'undefined') {
    return next(req);
  }

  const token = localStorage.getItem('token');
  const isAuthRequest = req.url.includes('/api/auth/');

  // 2. REGLA DE ORO: Si es login/register O ya tiene el header, NO TOCAR
  if (isAuthRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  // 3. Si tenemos token y NO es una petición de auth, lo ponemos
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  // 4. Por defecto, pasar la petición original
  return next(req);
};