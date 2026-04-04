import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(AuthService);
  const token = auth.getToken();
// Ahora permite localhost O tu nuevo backend en Render
if (token && (req.url.includes('localhost:8080') || req.url.includes('gym-backend-xwat.onrender.com'))) {    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
  return next(req);
};
