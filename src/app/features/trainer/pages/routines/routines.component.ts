import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RutinaService, Rutina } from '../../../../core/services/rutina.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.scss']
})
export class RoutinesComponent implements OnInit {
  private rutinaService = inject(RutinaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  rutinas = signal<Rutina[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  userRole = this.auth.userRole;

  ngOnInit() {
    this.cargarRutinas();
  }

  cargarRutinas() {
    this.isLoading.set(true);

    const userId = this.auth.user()?.usuarioId;
    const userRole = this.auth.rolNormalizado();

    console.log('👤 userId:', userId);
    console.log('🎭 Rol normalizado:', userRole);

    if (userRole === 'ADMIN') {
      console.log('✅ ADMIN - Cargando todas las rutinas');
      this.rutinaService.listarTodas().subscribe({
        next: (data: Rutina[]) => {
          console.log('📊 Datos recibidos:', data);
          if (data && Array.isArray(data)) {
            this.rutinas.set(data);
          } else {
            console.warn('La respuesta no es un array:', data);
            this.rutinas.set([]);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.errorMsg.set('Error cargando rutinas');
          this.isLoading.set(false);
        }
      });
    } else if (userRole === 'ENTRENADOR' && userId) {
      console.log('✅ ENTRENADOR - Cargando rutinas del entrenador ID:', userId);

      this.rutinaService.obtenerPorCreador(userId).subscribe({
        next: (data: any) => {
          console.log('📊 Respuesta completa:', data);
          console.log('📊 Tipo de respuesta:', typeof data);
          console.log('📊 Es array:', Array.isArray(data));

          let rutinasArray: Rutina[] = [];
          if (Array.isArray(data)) {
            rutinasArray = data;
          } else if (data && data._embedded && data._embedded.rutinas) {
            rutinasArray = data._embedded.rutinas;
          } else if (data && data.content) {
            rutinasArray = data.content;
          } else if (data && typeof data === 'object') {
            rutinasArray = Object.values(data);
          }

          console.log('📊 Rutinas procesadas:', rutinasArray.length);
          this.rutinas.set(rutinasArray);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          console.error('Status:', err.status);
          console.error('Mensaje:', err.message);
          console.error('Error body:', err.error);

          if (err.status === 200 && err.error) {
            console.log('Intentando parsear respuesta no JSON:', err.error);
            try {
              const parsed = JSON.parse(err.error);
              if (Array.isArray(parsed)) {
                this.rutinas.set(parsed);
                this.isLoading.set(false);
                return;
              }
            } catch (e) {
              console.error('No se pudo parsear:', e);
            }
          }

          this.errorMsg.set('Error cargando rutinas: ' + (err.message || err.statusText));
          this.isLoading.set(false);
        }
      });
    } else {
     
    }
    next: (data: any) => {
  console.log('Primera rutina:', data[0]);
  console.log('Campos:', Object.keys(data[0] || {}));
}
  }
  verRutina(id: number) {
  this.router.navigate(['/trainer/rutinas/detalle', id]);
}

  eliminarRutina(id: number, nombre: string) {
    if (confirm(`¿Eliminar la rutina "${nombre}"?`)) {
      this.rutinaService.eliminarRutina(id).subscribe({
        next: () => this.cargarRutinas(),
        error: () => this.errorMsg.set('Error al eliminar la rutina')
      });
    }
  }

  volverAlDashboard(): void {
    const rol = this.auth.rolNormalizado();
    if (rol === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (rol === 'ENTRENADOR') {
      this.router.navigate(['/trainer/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }
}
