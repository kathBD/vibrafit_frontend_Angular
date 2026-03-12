import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticated;
  userRole        = this.authService.userRole;
  // Computed que lee el nombre desde el signal user
  userName        = computed(() => this.authService.user()?.nombre || '');

  logout(): void {
    this.authService.logout();
  }
  menuOpen = false;
toggleMenu() { this.menuOpen = !this.menuOpen; }
}

