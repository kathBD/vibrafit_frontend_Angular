import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb   = inject(FormBuilder);
  private auth = inject(AuthService);

  isLoading    = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm = this.fb.group({
    correo:   ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    document.body.classList.add('login-page');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-page');
  }

  onSubmit(): void {
  if (this.loginForm.invalid) return;
  this.isLoading.set(true);
  this.errorMessage.set('');
  
  const { correo, password } = this.loginForm.value;
  
  this.auth.login({ correo: correo!, password: password! }).subscribe({
    next: (response: any) => {
      this.isLoading.set(false);
      
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }

      // El rol que viene del backend (según lo que me dijiste)
      const userRole = response.role; 
      console.log('Rol detectado:', userRole);

      // Mapeo de rutas según tus archivos:
      if (userRole === 'ADMINISTRADOR' || userRole === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (userRole === 'ENTRENADOR') {
        this.router.navigate(['/trainer']);
      } else if (userRole === 'CLIENTE') {
        this.router.navigate(['/client']);
      } else {
        // Si no es ninguno de los anteriores, vamos a la raíz
        this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.isLoading.set(false);
      if (err.status === 401) this.errorMessage.set('Correo o contraseña incorrectos.');
      else this.errorMessage.set('Error de conexión con el servidor.');
    }
  });
}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}

