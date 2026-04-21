import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
<<<<<<< HEAD
  // 1. Evitar SSR (Renderizado en servidor) que a veces rompe Netlify
  if (typeof window === 'undefined') {
    return next(req);
=======
  const auth = inject(AuthService);
  const token = auth.getToken();
  
  // Elimina la condición de localhost
  if (token) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
>>>>>>> develop
  }

  const token = localStorage.getItem('vf_token');
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