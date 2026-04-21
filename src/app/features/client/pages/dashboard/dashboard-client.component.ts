import { Component, inject, computed, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardClientComponent {
  private auth = inject(AuthService);

  user     = this.auth.user;
  userName = computed(() => this.user()?.nombre || 'Cliente');
  menuOpen = false;

  

  cards = [
    { icon: 'bi-list-check',     title: 'Mis Rutinas', desc: 'Consulta tus rutinas asignadas por tu entrenador.', link: '/client/my-routines',  color: '#0d6efd' },
    { icon: 'bi-graph-up-arrow', title: 'Mi Progreso', desc: 'Revisa tu evolución física y estadísticas.',        link: '/client/progreso', color: '#212529' },
    { icon: 'bi-cash-coin',      title: 'Mis Planes',  desc: 'Consulta tus planes activos y pagos.',              link: '/client/planes',   color: '#f39c12' }
  ];

  logout(): void { this.auth.logout(); }
}
