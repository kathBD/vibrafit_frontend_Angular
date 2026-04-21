import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Rol {
  rolId?: number;
  nombre: string;
}

export interface Usuario {
  usuarioId: number;
  correo:    string;
  nombre:    string;
  telefono?: string;
  activo:    boolean;
  rol:       Rol;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);

  private readonly API       = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'vf_token';
  private readonly USER_KEY  = 'vf_user';

  private userSignal = signal<Usuario | null>(this.loadUser());

  user            = this.userSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null);
  userRole        = computed(() => this.userSignal()?.rol?.nombre || null);
  rolNormalizado  = computed(() => {
    const rol = this.userRole();
    if (!rol) return '';
    return rol === 'ADMINISTRADOR' ? 'ADMIN' : rol;
  });

  // ========== LOGIN CORREGIDO ==========
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
          this.userSignal.set(response.usuario);
          console.log('✅ Token guardado:', response.token.substring(0, 30) + '...');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): Usuario | null {
    return this.userSignal();
  }

  redirectByRole(): void {
    const rol = this.rolNormalizado();
    console.log('🔀 Redirigiendo por rol:', rol);
    if (rol === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (rol === 'ENTRENADOR') {
      this.router.navigate(['/trainer/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  private loadUser(): Usuario | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
