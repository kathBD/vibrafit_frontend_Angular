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
    next: (response) => { // Añadimos 'response' para ver qué llega
      this.isLoading.set(false);
      console.log('Respuesta del servidor:', response);
      console.log('¡Login exitoso! Detuvimos la redirección para probar.');
      
      // COMENTA ESTA LÍNEA TEMPORALMENTE
      // this.auth.redirectByRole(); 
      
      alert('¡Login exitoso! Mira la consola (F12)');
    },
    error: (err) => {
      this.isLoading.set(false);
      // ... resto de tu código de error
    }
  });
 }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}

