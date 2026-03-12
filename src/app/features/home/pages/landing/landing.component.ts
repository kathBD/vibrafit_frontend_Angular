import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  features = [
    { icon: 'bi-people-fill',           title: 'Gestión',    desc: 'Usuarios, rutinas',    link: '/auth/login' },
    { icon: 'bi-lightning-charge-fill', title: 'Ejercicios', desc: 'Ver ejercicios',        link: '/exercises/catalog' },
    { icon: 'bi-calendar-check-fill',   title: 'Rutinas',    desc: 'Tus entrenamientos',   link: '/auth/login' },
    { icon: 'bi-graph-up-arrow',        title: 'Progreso',   desc: 'Estadísticas',         link: '/auth/login' },
  ];
}
