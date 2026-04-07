import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RutinaService, Rutina } from '../../../core/services/rutina.service';
import { UsuarioService, Usuario } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routine-detail.component.html',
  styleUrls: ['./routine-detail.component.scss']
})
export class RoutineDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private rutinaService = inject(RutinaService);
  private usuarioService = inject(UsuarioService);

  rutina = signal<Rutina | null>(null);
  isLoading = signal(true);
  clientes = signal<Usuario[]>([]);
  showAssignModal = signal(false);
  selectedClienteId = signal<number | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarRutina(+id);
      this.cargarClientes();
    }
  }

  cargarRutina(id: number) {
    this.isLoading.set(true);
    this.rutinaService.obtenerPorId(id).subscribe({
      next: (data: Rutina) => {
        this.rutina.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  cargarClientes() {
    this.usuarioService.getUsuariosPorRol('CLIENTE').subscribe({
      next: (data: Usuario[]) => {
        this.clientes.set(data);
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  asignarCliente() {
    const rutinaId = this.rutina()?.rutinaId;
    const clienteId = this.selectedClienteId();
    if (rutinaId && clienteId) {
      this.rutinaService.asignarACliente(rutinaId, clienteId).subscribe({
        next: () => {
          this.cargarRutina(rutinaId);
          this.showAssignModal.set(false);
          alert('✅ Rutina asignada correctamente');
        },
        error: () => alert('❌ Error al asignar la rutina')
      });
    }
  }
}