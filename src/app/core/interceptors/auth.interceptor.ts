import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token de forma manual y segura
  const token = localStorage.getItem('token');

  // 2. Definir la URL de tu backend
  const backendUrl = 'gym-backend-xwat.onrender.com';

  // 3. Si la petición NO es de login y tenemos token, clonamos
  if (!req.url.includes('/api/auth/') && token && req.url.includes(backendUrl)) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 4. Si no, pasa la petición tal cual
  return next(req);
};