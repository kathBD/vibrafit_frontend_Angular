import { Component, inject, computed, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';

interface KpiCard {
  icon:  string;
  label: string;
  value: number | string;
  color: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class DashboardAdminComponent implements OnInit {
  private auth = inject(AuthService);
  private http  = inject(HttpClient);

  user     = this.auth.user;
  userName = computed(() => this.user()?.nombre || 'Administrador');
  menuOpen = false;

  totalUsuarios   = signal(0);
  totalClientes   = signal(0);
  totalEntrenadores = signal(0);

  kpis = computed<KpiCard[]>(() => [
    { icon: 'bi-people-fill',       label: 'Usuarios Registrados', value: this.totalUsuarios(),     color: '#0d6efd' },
    { icon: 'bi-person-fill',       label: 'Clientes Activos',     value: this.totalClientes(),     color: '#198754' },
    { icon: 'bi-person-badge-fill', label: 'Entrenadores',         value: this.totalEntrenadores(), color: '#f39c12' },
  ]);

  quickLinks = [
    { icon: 'bi-people-fill',       label: 'Gestionar Usuarios',  link: '/admin/usuarios',      color: '#0d6efd' },
    { icon: 'bi-lightning-fill',    label: 'Ver Ejercicios',       link: '/exercises/catalog',   color: '#198754' },
    { icon: 'bi-list-check',        label: 'Gestionar Rutinas',    link: '/admin/rutinas',       color: '#f39c12' },
    { icon: 'bi-bell-fill',         label: 'Notificaciones',       link: '/admin/notificaciones',color: '#dc3545' },
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    const token = this.auth.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('https://gym-backend-xwat.onrender.com/api/usuarios', { headers }).subscribe({
      next: (usuarios) => {
        this.totalUsuarios.set(usuarios.length);
        this.totalClientes.set(usuarios.filter(u => u.rol?.nombre === 'CLIENTE').length);
        this.totalEntrenadores.set(usuarios.filter(u => u.rol?.nombre === 'ENTRENADOR').length);
      },
      error: () => {
        this.totalUsuarios.set(0);
        this.totalClientes.set(0);
        this.totalEntrenadores.set(0);
      }
    });
  }

  logout(): void { this.auth.logout(); }
}
