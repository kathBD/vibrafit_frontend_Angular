import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ExerciseService, Exercise } from '../../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent implements OnInit {
  private exerciseService = inject(ExerciseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ejercicio = signal<Exercise | null>(null);
  cargando = signal(true);
  error = signal('');

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
    this.exerciseService.getExerciseById(id).subscribe({
      next: (data) => {
        this.ejercicio.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error.set('No se pudo cargar el ejercicio');
        this.cargando.set(false);
      }
    });
  }

  volverAlCatalogo() {
    this.router.navigate(['/exercises/catalog']);
  }

getColorNivel(nivel: string | undefined): string {
  if (!nivel) return '#9E9E9E'; // Gris para undefined

  switch(nivel) {
    case 'beginner': return '#4CAF50';
    case 'intermediate': return '#FF9800';
    case 'expert': return '#F44336';
    default: return '#9E9E9E';
  }
}
}
