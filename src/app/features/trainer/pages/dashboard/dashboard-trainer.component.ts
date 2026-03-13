import { Component, inject, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-trainer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-trainer.component.html',
  styleUrl: './dashboard-trainer.component.scss'
})
export class DashboardTrainerComponent {
  private auth = inject(AuthService);

  user = this.auth.user;
  userName = computed(() => this.user()?.nombre || 'Entrenador');
  menuOpen = signal(false);

  stats = signal({
    clientesActivos: 24,
    rutinasPendientes: 8,
    sesionesHoy: 5,
    clientesNuevos: 3
  });

  cards = [
    {
      icon: 'bi-person-lines-fill',
      title: 'Mis Clientes',
      desc: 'Gestiona tus clientes asignados, revisa su progreso y asigna rutinas.',
      link: '/trainer/clientes',
      color: '#0d6efd',
      badge: '24',
      badgeColor: '#ffc107'
    },
    {
      icon: 'bi-list-check',
      title: 'Rutinas',
      desc: 'Crea y asigna rutinas personalizadas a tus clientes.',
      link: '/trainer/rutinas',
      color: '#212529',
      badge: '8',
      badgeColor: '#dc3545'
    },
    {
      icon: 'bi-bar-chart-fill',
      title: 'Estadísticas',
      desc: 'Visualiza el rendimiento y progreso de tus clientes.',
      link: '/trainer/estadisticas',
      color: '#f39c12'
    },
    {
      icon: 'bi-calendar-check',
      title: 'Sesiones Hoy',
      desc: 'Revisa las sesiones programadas para hoy.',
      link: '/trainer/calendario',
      color: '#198754',
      badge: '5',
      badgeColor: '#0d6efd'
    }
  ];

  quickActions = [
    { icon: 'bi-plus-circle', label: 'Nueva Rutina', link: '/trainer/rutinas/nueva', color: '#0d6efd' },
    { icon: 'bi-search', label: 'Buscar Cliente', link: '/trainer/clientes/buscar', color: '#6c757d' },
    { icon: 'bi-file-text', label: 'Reporte Semanal', link: '/trainer/reportes', color: '#198754' }
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }

  getInitials(): string {
    const name = this.userName();
    return name.charAt(0).toUpperCase();
  }
}
