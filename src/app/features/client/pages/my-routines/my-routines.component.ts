import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Interfaz para la rutina (simplificada para el cliente)
export interface RutinaCliente {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  estado: 'activa' | 'completada' | 'pendiente';
  fechaAsignacion: Date;
  progreso: number; // porcentaje 0-100
  ejercicios: EjercicioRutinaCliente[];
}

export interface EjercicioRutinaCliente {
  nombre: string;
  series: number;
  repeticiones: number;
  peso: number;
  completado: boolean;
}

@Component({
  selector: 'app-my-routines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-routinescomponent.html',
  styleUrls: ['./my-routines.component.scss']
})
export class MyRoutinesComponent implements OnInit {
  private auth = inject(AuthService);

  isLoading = signal(true);
  rutinas = signal<RutinaCliente[]>([]);
  selectedRutina = signal<RutinaCliente | null>(null);
  showDetailModal = signal(false);

  // Nombre del cliente
  clienteNombre = this.auth.user()?.nombre || 'Cliente';

  ngOnInit() {
    this.cargarRutinasMock();
  }

  /**
   * Datos de ejemplo (mock) mientras no tengamos el backend de asignación
   * Estos datos simulan rutinas asignadas por un entrenador
   */
  cargarRutinasMock() {
    this.isLoading.set(true);

    // Simular carga de datos
    setTimeout(() => {
      const rutinasMock: RutinaCliente[] = [
        {
          id: 1,
          nombre: 'Rutina de Fuerza - Semana 1',
          descripcion: 'Rutina enfocada en ganancia de fuerza muscular. Realizar 3 veces por semana.',
          nivel: 'intermedio',
          estado: 'activa',
          fechaAsignacion: new Date('2026-04-01'),
          progreso: 60,
          ejercicios: [
            { nombre: 'Press de Banca', series: 4, repeticiones: 10, peso: 60, completado: true },
            { nombre: 'Sentadilla', series: 4, repeticiones: 12, peso: 80, completado: true },
            { nombre: 'Peso Muerto', series: 3, repeticiones: 8, peso: 100, completado: false },
            { nombre: 'Dominadas', series: 3, repeticiones: 8, peso: 0, completado: false }
          ]
        },
        {
          id: 2,
          nombre: 'Rutina Cardiovascular',
          descripcion: 'Rutina para mejorar resistencia cardiovascular.',
          nivel: 'principiante',
          estado: 'activa',
          fechaAsignacion: new Date('2026-04-03'),
          progreso: 25,
          ejercicios: [
            { nombre: 'Trotar', series: 1, repeticiones: 1, peso: 0, completado: true },
            { nombre: 'Ciclismo', series: 1, repeticiones: 1, peso: 0, completado: false },
            { nombre: 'Cuerda', series: 3, repeticiones: 30, peso: 0, completado: false }
          ]
        },
        {
          id: 3,
          nombre: 'Rutina de Flexibilidad',
          descripcion: 'Ejercicios de estiramiento para mejorar flexibilidad.',
          nivel: 'principiante',
          estado: 'completada',
          fechaAsignacion: new Date('2026-03-25'),
          progreso: 100,
          ejercicios: [
            { nombre: 'Estiramiento de isquiotibiales', series: 3, repeticiones: 30, peso: 0, completado: true },
            { nombre: 'Estiramiento de cuádriceps', series: 3, repeticiones: 30, peso: 0, completado: true }
          ]
        }
      ];

      this.rutinas.set(rutinasMock);
      this.isLoading.set(false);
    }, 500);
  }

  verDetalle(rutina: RutinaCliente) {
    this.selectedRutina.set(rutina);
    this.showDetailModal.set(true);
  }

  cerrarDetalle() {
    this.showDetailModal.set(false);
    this.selectedRutina.set(null);
  }

  marcarEjercicioCompletado(rutina: RutinaCliente, ejercicioIndex: number) {
    const ejercicio = rutina.ejercicios[ejercicioIndex];
    ejercicio.completado = !ejercicio.completado;

    // Recalcular progreso
    const completados = rutina.ejercicios.filter(e => e.completado).length;
    rutina.progreso = Math.round((completados / rutina.ejercicios.length) * 100);

    // Actualizar la señal
    this.rutinas.update(ruts => [...ruts]);
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activa': return 'bg-success';
      case 'completada': return 'bg-info';
      case 'pendiente': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getNivelBadgeClass(nivel: string): string {
    switch (nivel) {
      case 'principiante': return 'badge-principiante';
      case 'intermedio': return 'badge-intermedio';
      case 'experto': return 'badge-experto';
      default: return 'badge-default';
    }
  }
}
