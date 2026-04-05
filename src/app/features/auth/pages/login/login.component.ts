import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // <--- IMPORTANTE: Router añadido aquí
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
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router); // <--- ESTA LÍNEA ES LA QUE FALTA Y CAUSA EL ERROR

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
  
  const { correo, password } = this.loginForm.value;
  
  this.auth.login({ correo: correo!, password: password! }).subscribe({
    next: (res: any) => {
      this.isLoading.set(false);
      
      // 1. Guardar el token (vf_token es el nombre que usa tu AuthService)
      if (res.token) {
        localStorage.setItem('vf_token', res.token);
      }

      // 2. EXTRAER EL ROL CORRECTAMENTE
      // Navegamos por el objeto: res -> usuario -> rol -> nombre
      const userRole = res.usuario?.rol?.nombre;
      console.log('Rol detectado con éxito:', userRole);

      // 3. Redirección basada en el nombre exacto
      if (userRole === 'ADMINISTRADOR') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userRole === 'ENTRENADOR') {
        this.router.navigate(['/trainer/dashboard']);
      } else if (userRole === 'CLIENTE') {
        this.router.navigate(['/client/dashboard']);
      } else {
        // Si algo falla, al menos que vaya al home y no se quede en blanco
        this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.isLoading.set(false);
      this.errorMessage.set(err.status === 401 ? 'Credenciales inválidas' : 'Error de conexión');
    }
  });
}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}