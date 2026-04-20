import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RutinaService, Rutina } from '../../../../core/services/rutina.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-my-routines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-routines.component.html',
  styleUrls: ['./my-routines.component.scss']
})
export class MyRoutinesComponent implements OnInit {
  private rutinaService = inject(RutinaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  rutinas = signal<Rutina[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');
  showDetailModal = signal(false);
  selectedRutina = signal<Rutina | null>(null);

  ngOnInit() {
    this.cargarMisRutinas();
  }

  cargarMisRutinas() {
    this.isLoading.set(true);
    const clienteId = this.auth.user()?.usuarioId;
    
    console.log('👤 Cliente ID:', clienteId);
    
    if (!clienteId) {
      this.errorMsg.set('No se pudo identificar al cliente');
      this.isLoading.set(false);
      return;
    }

    this.rutinaService.obtenerPorCliente(clienteId).subscribe({
      next: (data: any[]) => {
        console.log('📊 Rutinas asignadas:', data);
        // Agregar estado por defecto a cada rutina
        const rutinasConEstado = data.map(rutina => ({
          ...rutina,
          estado: rutina.activo ? 'activa' : 'inactiva',
           diaSemana: rutina.diaSemana || 'No especificado'
        }));
        this.rutinas.set(rutinasConEstado);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.errorMsg.set('Error cargando tus rutinas');
        this.isLoading.set(false);
      }
    });
  }

  getEstadoBadgeClass(estado: string | undefined): string {
    const estadoLower = (estado || '').toLowerCase();
    switch(estadoLower) {
      case 'activa': return 'bg-success';
      case 'completada': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getNivelBadgeClass(nivel: string | undefined): string {
    const nivelLower = (nivel || '').toLowerCase();
    switch(nivelLower) {
      case 'principiante': return 'bg-info';
      case 'intermedio': return 'bg-warning';
      case 'avanzado': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  verDetalle(rutina: Rutina) {
    // Asegurar que tiene estado
    const rutinaConEstado = {
      ...rutina,
      estado: rutina.estado || (rutina.activo ? 'activa' : 'inactiva')
    };
    this.selectedRutina.set(rutinaConEstado);
    this.showDetailModal.set(true);
  }

  cerrarDetalle() {
    this.showDetailModal.set(false);
    this.selectedRutina.set(null);
  }

  volverAlDashboard() {
    this.router.navigate(['/client/dashboard']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  userName() {
    return this.auth.user()?.nombre || 'Cliente';
  }
}