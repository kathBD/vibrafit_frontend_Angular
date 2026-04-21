import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Rol {
  rolId?: number;
  nombre: string;
}

export interface Usuario {
  usuarioId?:      number;
  nombre:          string;
  correo:          string;
  password?:       string;
  telefono?:       string;
  sexo?:           string;
  peso?:           number;
  estatura?:       number;
<<<<<<< HEAD
  activo?:         boolean;      // ← Para uso interno
=======
  activo?:         boolean;
>>>>>>> develop
  especialidad?:   string;
  horarioInicio?:  string;
  horarioFin?:     string;
  fechaNacimiento?: string;
  fechaRegistro?:  string;
  rol:             Rol;
  objetivo?:       string;
  estadoFisico?:   string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private readonly API = 'https://gym-backend-xwat.onrender.com/api/usuarios';

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // ========== CRUD USUARIOS ==========

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API, { headers: this.headers() });
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`, { headers: this.headers() });
  }

  // ✅ MÉTODO CORREGIDO - Usa this.API (no apiUrl)
  getUsuariosPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/rol/${rol}`, { 
      headers: this.headers() 
    });
  }

  // ❌ ELIMINAR este método duplicado (está mal escrito)
  // getPorRol(rol: string): Observable<Usuario[]> { ... }

  crear(usuario: Usuario): Observable<Usuario> {
    const usuarioBackend = this.transformarParaBackend(usuario);
    return this.http.post<Usuario>(this.API, usuarioBackend, { headers: this.headers() });
  }

  editar(id: number, usuario: Usuario): Observable<Usuario> {
    const usuarioBackend = this.transformarParaBackend(usuario);
    return this.http.put<Usuario>(`${this.API}/${id}`, usuarioBackend, { headers: this.headers() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.headers() });
  }

  // ========== PERFIL ==========

  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/perfil`, { headers: this.headers() });
  }

  actualizarPerfil(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/perfil`, usuario, { headers: this.headers() });
  }

  cambiarPassword(data: { passwordActual: string; passwordNueva: string }): Observable<any> {
    return this.http.post(`${this.API}/cambiar-password`, data, { headers: this.headers() });
  }

  // ========== TRANSFORMACIÓN ==========

  private transformarParaBackend(usuario: Usuario): any {
    const backendObj: any = {
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: usuario.password,
      telefono: usuario.telefono || "",
      sexo: usuario.sexo || "M",
      fechaNacimiento: usuario.fechaNacimiento,
      peso: usuario.peso || 0,
      estatura: usuario.estatura || 0,
      objetivo: usuario.objetivo || "",
      estadoFisico: usuario.estadoFisico || "",
      especialidad: usuario.especialidad || "",
      horarioInicio: usuario.horarioInicio || "",
      horarioFin: usuario.horarioFin || "",
<<<<<<< HEAD
      activo: usuario.activo !== undefined ? usuario.activo : true,  // ← CLAVE: convertir activo a esta_activo
      // CORRECCIÓN 2: Ya no quemamos el 1. Usamos el ID que viene del objeto
=======
      activo: usuario.activo !== undefined ? usuario.activo : true,
>>>>>>> develop
      rol: {
        rolId: usuario.rol?.rolId
      }
    };

    if (usuario.usuarioId) {
      backendObj.usuarioId = usuario.usuarioId;
    }

    return backendObj;
  }
}
