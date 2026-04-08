import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface EjercicioRutina {
  ejercicioRutinaId?: number;
  exercise: { id: string; name: string };
  series: number;
  repeticiones: number;
  peso: number;
  orden: number;
  descanso: number;
}

export interface Rutina {
  rutinaId?: number;
  nombre: string;
  descripcion: string;
  objetivo?: string;     
  nivel?: string;         
  activo: boolean;
  estaActiva?: boolean;   
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  creador?: { usuarioId: number; nombre: string };
  cliente?: { usuarioId: number; nombre: string };
  ejercicios?: EjercicioRutina[];
}

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private apiUrl = 'http://localhost:8080/api/rutinas';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders() {
    return { 'Authorization': `Bearer ${this.auth.getToken()}` };
  }

  // ========== CRUD RUTINAS ==========

crearRutina(rutina: Rutina): Observable<Rutina> {
  const token = this.auth.getToken();
  console.log('Token enviado:', token ? token.substring(0, 30) + '...' : 'NO HAY TOKEN');
  return this.http.post<Rutina>(this.apiUrl, rutina, { headers: this.getHeaders() });
}

  listarTodas(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<Rutina> {
    return this.http.get<Rutina>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // En rutina.service.ts
obtenerPorCreador(creadorId: number): Observable<any> {
  const url = `${this.apiUrl}/creador/${creadorId}`;
  console.log('📡 GET URL:', url);
  
  return this.http.get(url, { 
    headers: this.getHeaders(),
    observe: 'response',  // Para ver la respuesta completa
    responseType: 'json'
  }).pipe(
    map(response => {
      console.log('📡 Respuesta completa:', response);
      console.log('📡 Body:', response.body);
      return response.body;
    }),
    catchError(error => {
      console.error('❌ Error en petición:', error);
      console.error('❌ Error response:', error.error);
      return throwError(() => error);
    })
  );
}

  obtenerPorCliente(clienteId: number): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers: this.getHeaders() });
  }

  obtenerMisRutinas(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${this.apiUrl}/mis-rutinas`, { headers: this.getHeaders() });
  }

  actualizarRutina(id: number, rutina: Rutina): Observable<Rutina> {
    return this.http.put<Rutina>(`${this.apiUrl}/${id}`, rutina, { headers: this.getHeaders() });
  }

  eliminarRutina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  asignarACliente(rutinaId: number, clienteId: number): Observable<Rutina> {
    return this.http.put<Rutina>(`${this.apiUrl}/${rutinaId}/asignar-cliente/${clienteId}`, null, { headers: this.getHeaders() });
  }
}
