import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token directamente del localStorage (Cero inyecciones de servicios)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // 2. Si es login o registro, dejar pasar SIN TOCAR NADA
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // 3. Si hay un token guardado, clonamos la petición
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  // 4. Si no hay token, enviar la petición original
  return next(req);
};