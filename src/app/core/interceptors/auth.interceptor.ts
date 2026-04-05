import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //const auth = inject(AuthService);
  //const token = auth.getToken();
  const token = localStorage.getItem('token');  // Si hay token y la URL es de nuestro backend en Render, lo añadimos
  
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  if (token && req.url.includes('gym-backend-xwat.onrender.com')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  return next(cloned);
  }

  // Si no se cumple lo anterior, enviamos la petición tal cual
  return next(req);
};