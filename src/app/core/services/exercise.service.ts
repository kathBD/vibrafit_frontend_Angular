// core/services/exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Exercise {
  id?: string;
  name: string;
  instructions?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  level?: string;
  category?: string;
  images?: string[];
  imageUrl?: string | null;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private apiBase = 'http://localhost:8080/api';
  // Usa el endpoint que funciona en tu backend
  private apiUrl = `${this.apiBase}/rutinas/ejercicios`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders() {
    return { 'Authorization': `Bearer ${this.auth.getToken()}` };
  }

  getAllExercises(): Observable<Exercise[]> {
    console.log('📥 Llamando a:', this.apiUrl);
    return this.http.get<Exercise[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiBase}/exercises/${id}`, {
      headers: this.getHeaders()
    });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBase}/exercises/categories`, {
      headers: this.getHeaders()
    });
  }
  getWgerExercises(): Observable<Exercise[]> {
  return this.http.get<Exercise[]>('https://wger.de/api/v2/exerciseinfo/?limit=50');
}
}
