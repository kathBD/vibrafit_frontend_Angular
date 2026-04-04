import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ExerciseService, Exercise } from '../../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private exerciseService = inject(ExerciseService);

  ejercicio = signal<Exercise | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  imagenError = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEjercicio(id);
    } else {
      this.error.set('ID de ejercicio no encontrado');
      this.cargando.set(false);
    }
  }

  cargarEjercicio(id: string) {
    this.cargando.set(true);
    this.error.set(null);

    this.exerciseService.getExerciseById(id).subscribe({
      next: (data: Exercise) => {
        this.ejercicio.set(data);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando ejercicio:', err);
        this.error.set('No se pudo cargar el ejercicio. Por favor, intenta de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  onImageError() {
    this.imagenError.set(true);
  }

  getImageUrl(): string | null {
    const ejercicio = this.ejercicio();
    if (!ejercicio) return null;

    if (this.imagenError()) return null;

    // Para ejercicios locales
    if (ejercicio.images && ejercicio.images.length > 0) {
      return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ejercicio.images[0]}`;
    }

    // Para ejercicios de Wger
    if (ejercicio.imageUrl) {
      return ejercicio.imageUrl;
    }

    return null;
  }

  getEquipmentName(equipment: string): string {
    const equipmentMap: {[key: string]: string} = {
      'body only': 'Peso corporal',
      'dumbbell': 'Mancuernas',
      'barbell': 'Barra',
      'kettlebells': 'Kettlebells',
      'machine': 'Máquina',
      'cable': 'Cable',
      'bands': 'Bandas elásticas',
      'medicine ball': 'Balón medicinal',
      'exercise ball': 'Pelota de ejercicios',
      'foam roll': 'Rodillo de espuma',
      'other': 'Otro'
    };
    return equipmentMap[equipment] || equipment;
  }

  getCategoryName(category: string): string {
    const categoryMap: {[key: string]: string} = {
      'strength': 'Fuerza',
      'stretching': 'Estiramiento',
      'cardio': 'Cardio',
      'plyometrics': 'Pliometría',
      'powerlifting': 'Powerlifting',
      'strongman': 'Strongman',
      'olympic weightlifting': 'Pesas olímpicas'
    };
    return categoryMap[category] || category;
  }

  getLevelName(level: string): string {
    const levelMap: {[key: string]: string} = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'expert': 'Experto'
    };
    return levelMap[level] || level;
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'expert': return '#F44336';
      default: return '#9E9E9E';
    }
  }
}
