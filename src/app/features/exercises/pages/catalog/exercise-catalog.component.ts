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

  ejercicios = signal<Exercise[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  categoriaSeleccionada = signal('todas');
  categorias = signal<string[]>([]);
  nivelSeleccionado = signal('todos');
  niveles = signal<string[]>(['beginner', 'intermediate', 'expert']);

  fuenteSeleccionada = signal<'local' | 'wger'>('local');
  imagenesConError = signal<Set<string>>(new Set());

  ejerciciosFiltrados = computed(() => {
    let lista = this.ejercicios();

    const normalizar = (t: string) =>
      t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const termino = normalizar(this.terminoBusqueda().trim());
    const categoria = this.categoriaSeleccionada();
    const nivel = this.nivelSeleccionado();

    if (termino) {
      lista = lista.filter(e => {
        const nombre = normalizar(e.name || '');
        const musculos = normalizar((e.primaryMuscles || []).join(' '));
        const categoriaTxt = normalizar(e.category || '');

        return (
          nombre.includes(termino) ||
          musculos.includes(termino) ||
          categoriaTxt.includes(termino)
        );
      });
    }

    if (categoria !== 'todas' && this.fuenteSeleccionada() === 'local') {
      lista = lista.filter(e =>
        (e.category || '').toLowerCase() === categoria.toLowerCase()
      );
    }

    if (nivel !== 'todos') {
      lista = lista.filter(e =>
        (e.level || '').toLowerCase() === nivel.toLowerCase()
      );
    }

    return lista;
  });

  ngOnInit() {
    this.cargarEjercicios();
    this.cargarCategorias();
  }

  cargarEjercicios() {
    this.cargando.set(true);
    this.imagenesConError.set(new Set());

    if (this.fuenteSeleccionada() === 'local') {
      this.exerciseService.getAllExercises().subscribe({
        next: (data: Exercise[]) => {
          console.log('Ejercicios locales cargados:', data.length);
          this.ejercicios.set(data);
          this.cargando.set(false);
        },
        error: (err: any) => {
          console.error('Error cargando locales:', err);
          this.cargando.set(false);
        }
      });
    } else {
      this.exerciseService.getWgerExercises().subscribe({
        next: (data: Exercise[]) => {
          console.log('Ejercicios Wger cargados:', data.length);
          this.ejercicios.set(data);
          this.cargando.set(false);
        },
        error: (err: any) => {
          console.error('Error cargando Wger:', err);
          this.cargando.set(false);
        }
      });
    }
  }

  cargarCategorias() {
    this.exerciseService.getCategories().subscribe({
      next: (data: string[]) => this.categorias.set(data),
      error: (err: any) => console.error('Error cargando categorías:', err)
    });
  }

  cambiarFuente(fuente: string) {
    this.fuenteSeleccionada.set(fuente as 'local' | 'wger');
    this.cargarEjercicios();
  }

  getColorNivel(nivel: string): string {
    switch (nivel) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'expert': return '#F44336';
      default: return '#9E9E9E';
    }
  }

  onImageError(exerciseId: string) {
    this.imagenesConError.update(set => {
      const newSet = new Set(set);
      newSet.add(exerciseId);
      return newSet;
    });
  }

  showPlaceholder(exerciseId: string): boolean {
    return this.imagenesConError().has(exerciseId);
  }

  getImageUrl(ejercicio: Exercise): string {
    if (this.showPlaceholder(ejercicio.id || '')) {
      return '';
    }

    if (this.fuenteSeleccionada() === 'local' && ejercicio.images && ejercicio.images.length > 0) {
      return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ejercicio.images[0]}`;
    }

    if (this.fuenteSeleccionada() === 'wger' && ejercicio.imageUrl) {
      return ejercicio.imageUrl;
    }

    return '';
  }

  getInitials(name: string): string {
    if (!name) return '💪';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}
