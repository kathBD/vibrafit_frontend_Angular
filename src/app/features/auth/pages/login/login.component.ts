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
      
      // 1. Guardar el token (esto es vital para que el interceptor funcione después)
      if (response && response.token) {
        localStorage.setItem('token', response.token);
      }

      // 2. Lógica de redirección basada en el rol exacto
      // IMPORTANTE: Asegúrate de que 'response.role' sea el campo correcto 
      // (mira tu consola F12 para confirmar si es .role, .rol o .authority)
      const userRole = response.role; 

      console.log('Rol recibido:', userRole);

      if (userRole === 'ADMINISTRADOR') {
        console.log('Navegando a Admin...');
        this.router.navigate(['/admin']); // Cambia por tu ruta real de admin
      } else {
        console.log('Navegando a Usuario/Home...');
        this.router.navigate(['/home']); // Ruta para usuarios normales
      }
    },
    error: (err) => {
      this.isLoading.set(false);
      if (err.status === 401) this.errorMessage.set('Correo o contraseña incorrectos.');
      else this.errorMessage.set('Error en la conexión con el servidor.');
    }
  });
}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}

