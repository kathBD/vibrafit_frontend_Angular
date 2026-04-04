import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Si hay token y la URL es de nuestro backend en Render, lo añadimos
  if (token && req.url.includes('gym-backend-xwat.onrender.com')) {
    return next(req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }));
  }

  // Si no se cumple lo anterior, enviamos la petición tal cual
  return next(req);
};