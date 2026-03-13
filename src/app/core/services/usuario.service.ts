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
  activo?:         boolean;
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

  private readonly API = 'http://localhost:8080/api/usuarios';

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
    return this.http.post<Usuario>(this.API, usuario, { headers: this.headers() });
  }

  editar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/${id}`, usuario, { headers: this.headers() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.headers() });
  }
}
