import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NavbarComponent } from '../../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { correo, password } = this.loginForm.value;

    this.auth.login({ correo: correo!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.auth.redirectByRole();
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.isLoading.set(false);

        if (err.status === 401) {
          this.errorMessage.set('Correo o contraseña incorrectos.');
        } else if (err.status === 403) {
          this.errorMessage.set('Usuario inactivo o sin acceso.');
        } else {
          this.errorMessage.set('No se pudo conectar con el servidor.');
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
