import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RutinaService, Rutina } from '../../../../core/services/rutina.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl:'./routines.component.html',
  styleUrls:['./routines.component.scss']
})
export class RoutinesComponent implements OnInit {
  private rutinaService = inject(RutinaService);
  private auth = inject(AuthService);

  rutinas = signal<Rutina[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  userRole = this.auth.userRole;

  ngOnInit() {
    this.cargarRutinas();
  }

  cargarRutinas() {
    this.isLoading.set(true);
console.log('🔍 Cargando rutinas...');
    const userId = this.auth.user()?.usuarioId;

    if (this.userRole() === 'ENTRENADOR' && userId) {
      this.rutinaService.obtenerPorCreador(userId).subscribe({
        next: (data: Rutina[]) => {
          this.rutinas.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMsg.set('Error cargando rutinas');
          this.isLoading.set(false);
        }
      });
    } else {
      this.rutinaService.listarTodas().subscribe({
        next: (data: Rutina[]) => {
          this.rutinas.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMsg.set('Error cargando rutinas');
          this.isLoading.set(false);
        }
      });
    }
  }

  eliminarRutina(id: number, nombre: string) {
    if (confirm(`¿Eliminar la rutina "${nombre}"?`)) {
      this.rutinaService.eliminarRutina(id).subscribe({
        next: () => this.cargarRutinas(),
        error: () => this.errorMsg.set('Error al eliminar la rutina')
      });
    }
  }
}
