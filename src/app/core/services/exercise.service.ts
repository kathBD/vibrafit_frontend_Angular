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
  force?: string;
  mechanic?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private apiBase = 'http://localhost:8080/api';
  private apiUrl = `${this.apiBase}/exercises`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders() {
    return { 'Authorization': `Bearer ${this.auth.getToken()}` };
  }

  // ✅ EJERCICIOS LOCALES (CON TOKEN)
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ WGER (SIN TOKEN 🚨)
getWgerExercises(): Observable<Exercise[]> {
  return this.http.get<Exercise[]>('http://localhost:8080/api/wger/exercises');
}

  // ✅ FILTROS
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders()
    });
  }

  getMuscles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/muscles`, {
      headers: this.getHeaders()
    });
  }

  getBodyParts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/body-parts`, {
      headers: this.getHeaders()
    });
  }
}
