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
  activo?:         boolean;      // ← Para uso interno
  especialidad?:   string;
  horarioInicio?:  string;
  horarioFin?:     string;
  fechaNacimiento?: string;
  fechaRegistro?:  string;
  rol:             Rol;
  objetivo?:       string;
  estadoFisico?:   string;
}

export interface Rol {
  rolId?: number;
  nombre: string;
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

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API, { headers: this.headers() });
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`, { headers: this.headers() });
  }

  getPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/rol/${rol}`, { headers: this.headers() });
  }

  crear(usuario: Usuario): Observable<Usuario> {
    // Transformar para el backend
    const usuarioBackend = this.transformarParaBackend(usuario);
    console.log('Enviando al backend:', usuarioBackend); // Para depurar
    return this.http.post<Usuario>(this.API, usuarioBackend, { headers: this.headers() });
  }

  editar(id: number, usuario: Usuario): Observable<Usuario> {
    // Transformar para el backend
    const usuarioBackend = this.transformarParaBackend(usuario);
    return this.http.put<Usuario>(`${this.API}/${id}`, usuarioBackend, { headers: this.headers() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.headers() });
  }

  // Método para transformar el objeto de Angular al formato que espera el backend
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
      activo: usuario.activo !== undefined ? usuario.activo : true,  // ← CLAVE: convertir activo a esta_activo
      // CORRECCIÓN 2: Ya no quemamos el 1. Usamos el ID que viene del objeto
      rol: {
        rolId: usuario.rol?.rolId 
      }
    };

    // Solo incluir ID si existe
    if (usuario.usuarioId) {
      backendObj.usuarioId = usuario.usuarioId;
    }

    return backendObj;
  }
}
