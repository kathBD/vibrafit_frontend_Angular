import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private auth           = inject(AuthService);
  private router         = inject(Router);

  usuario          = signal<Usuario | null>(null);
  isLoading        = signal(true);
  isEditing        = signal(false);
  showPasswordModal = signal(false);
  successMsg       = signal('');
  errorMsg         = signal('');

  profileForm = this.fb.group({
    nombre:       ['', Validators.required],
    telefono:     [''],
    sexo:         ['M'],
    peso:         [0],
    estatura:     [0],
    objetivo:     [''],
    estadoFisico: ['']
  });

  passwordForm = this.fb.group({
    passwordActual:    ['', Validators.required],
    passwordNueva:     ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', Validators.required]
  });

  ngOnInit() {
    this.cargarPerfil();
  }

  volverAlDashboard(): void {
    const rol = this.auth.rolNormalizado();
    if (rol === 'ADMIN')           this.router.navigate(['/admin/dashboard']);
    else if (rol === 'ENTRENADOR') this.router.navigate(['/trainer/dashboard']);
    else                           this.router.navigate(['/client/dashboard']);
  }

  cargarPerfil() {
    this.isLoading.set(true);
    this.usuarioService.getPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.profileForm.patchValue({
          nombre:       data.nombre || '',
          telefono:     data.telefono || '',
          sexo:         data.sexo || 'M',
          peso:         data.peso || 0,
          estatura:     data.estatura || 0,
          objetivo:     data.objetivo || '',
          estadoFisico: data.estadoFisico || ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg.set('Error al cargar el perfil');
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) this.cargarPerfil();
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const usuarioActualizado = {
      nombre:       this.profileForm.value.nombre || '',
      telefono:     this.profileForm.value.telefono || '',
      sexo:         this.profileForm.value.sexo || 'M',
      peso:         this.profileForm.value.peso || 0,
      estatura:     this.profileForm.value.estatura || 0,
      objetivo:     this.profileForm.value.objetivo || '',
      estadoFisico: this.profileForm.value.estadoFisico || ''
    };

    this.isLoading.set(true);
    this.usuarioService.actualizarPerfil(usuarioActualizado).subscribe({
      next: (data) => {
        this.usuario.set(data);
        this.successMsg.set('Perfil actualizado correctamente');
        this.isEditing.set(false);
        this.isLoading.set(false);
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg.set('Error al actualizar el perfil');
        this.isLoading.set(false);
        setTimeout(() => this.errorMsg.set(''), 3000);
      }
    });
  }

  openPasswordModal()  { this.passwordForm.reset(); this.showPasswordModal.set(true); }
  closePasswordModal() { this.showPasswordModal.set(false); this.passwordForm.reset(); }

  cambiarPassword() {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.passwordNueva !== this.passwordForm.value.confirmarPassword) {
      this.errorMsg.set('Las contraseñas no coinciden');
      setTimeout(() => this.errorMsg.set(''), 3000);
      return;
    }

    const data = {
      passwordActual: this.passwordForm.value.passwordActual!,
      passwordNueva:  this.passwordForm.value.passwordNueva!
    };

    this.isLoading.set(true);
    this.usuarioService.cambiarPassword(data).subscribe({
      next: () => {
        this.successMsg.set('Contraseña actualizada correctamente');
        this.closePasswordModal();
        this.isLoading.set(false);
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg.set(err.error?.message || 'Error al cambiar la contraseña');
        this.isLoading.set(false);
        setTimeout(() => this.errorMsg.set(''), 3000);
      }
    });
  }

  getRolNombre(): string {
    const rol = this.usuario()?.rol?.nombre;
    switch (rol) {
      case 'ADMINISTRADOR': return 'Administrador';
      case 'ENTRENADOR':    return 'Entrenador';
      case 'CLIENTE':       return 'Cliente';
      default:              return 'Usuario';
    }
  }

  getRolColor(): string {
    const rol = this.usuario()?.rol?.nombre;
    switch (rol) {
      case 'ADMINISTRADOR': return '#dc3545';
      case 'ENTRENADOR':    return '#f39c12';
      case 'CLIENTE':       return '#0d6efd';
      default:              return '#6c757d';
    }
  }

  getInitials(): string {
    return (this.usuario()?.nombre || 'U').charAt(0).toUpperCase();
  }
}