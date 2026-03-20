import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExerciseService, Exercise } from '../../../../core/services/exercise.service';

@Component({
  selector: 'app-exercise-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exercise-catalog.component.html',
  styleUrls: ['./exercise-catalog.component.scss']
})
export class ExerciseCatalogComponent implements OnInit {
  private exerciseService = inject(ExerciseService);

  // Señales
  ejercicios = signal<Exercise[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  categoriaSeleccionada = signal('todas');
  categorias = signal<string[]>([]);
  nivelSeleccionado = signal('todos');
  niveles = signal<string[]>(['beginner', 'intermediate', 'expert']);

  // Fuente seleccionada
  fuenteSeleccionada = signal<'local' | 'wger'>('local');

  // Computed para filtrar
  ejerciciosFiltrados = computed(() => {
    let lista = this.ejercicios();
    const termino = this.terminoBusqueda().toLowerCase();
    const categoria = this.categoriaSeleccionada();
    const nivel = this.nivelSeleccionado();

    if (termino) {
      lista = lista.filter(e =>
        e.name.toLowerCase().includes(termino) ||
        e.primaryMuscles?.some((m: string) => m.toLowerCase().includes(termino))
      );
    }

    if (categoria !== 'todas') {
      lista = lista.filter(e =>
        e.category?.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (nivel !== 'todos') {
      lista = lista.filter(e =>
        e.level?.toLowerCase() === nivel.toLowerCase()
      );
    }

    return lista.slice(0, 50);
  });

  ngOnInit() {
    this.cargarEjercicios();
    this.cargarCategorias();
  }

 cargarEjercicios() {
  this.cargando.set(true);

  if (this.fuenteSeleccionada() === 'local') {

    this.exerciseService.getAllExercises().subscribe({
      next: (data: Exercise[]) => {
        this.ejercicios.set(data);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.cargando.set(false);
      }
    });

  } else {

    // ✅ AQUÍ VA EL CÓDIGO QUE TE DI
    this.exerciseService.getWgerExercises().subscribe({
      next: (data: Exercise[]) => {
        this.ejercicios.set(data);
        this.cargando.set(false);
      },
      error: (err: any) => {
        console.error('Error Wger:', err);
        this.cargando.set(false);
      }
    });

  }
}

  cargarCategorias() {
    this.exerciseService.getCategories().subscribe({
      next: (data: string[]) => this.categorias.set(data),
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  // Cambiar fuente de ejercicios
  cambiarFuente(fuente: string) {
    this.fuenteSeleccionada.set(fuente as 'local' | 'wger');
    this.cargarEjercicios();
  }

  // Método para obtener el color según el nivel
  getColorNivel(nivel: string): string {
    switch (nivel) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'expert': return '#F44336';
      default: return '#9E9E9E';
    }
  }
}
