import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService, Usuario } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private auth           = inject(AuthService);
  private fb             = inject(FormBuilder);

  // ── State ──────────────────────────────────
  usuarios     = signal<Usuario[]>([]);
  isLoading    = signal(false);
  errorMsg     = signal('');
  successMsg   = signal('');
  showModal    = signal(false);
  showDeleteModal = signal(false);
  isEditing    = signal(false);
  selectedUser = signal<Usuario | null>(null);
  searchTerm   = signal('');
  filterRol    = signal('TODOS');

  // ── Computed ───────────────────────────────
  filteredUsuarios = computed(() => {
    let list = this.usuarios();
    const term = this.searchTerm().toLowerCase();
    const rol  = this.filterRol();

    if (term) {
      list = list.filter(u =>
        u.nombre.toLowerCase().includes(term) ||
        u.correo.toLowerCase().includes(term)
      );
    }
    if (rol !== 'TODOS') {
      list = list.filter(u => u.rol?.nombre === rol);
    }
    return list;
  });

  totalUsuarios    = computed(() => this.usuarios().length);
  totalClientes    = computed(() => this.usuarios().filter(u => u.rol?.nombre === 'CLIENTE').length);
  totalEntrenadores = computed(() => this.usuarios().filter(u => u.rol?.nombre === 'ENTRENADOR').length);
  totalAdmins      = computed(() => this.usuarios().filter(u => u.rol?.nombre === 'ADMINISTRADOR').length);

  // ── Form ───────────────────────────────────
  userForm = this.fb.group({
    nombre:          ['', Validators.required],
    correo:          ['', [Validators.required, Validators.email]],
    password:        [''],
    telefono:        [''],
    sexo:            ['M'],
    peso:            [null],
    estatura:        [null],
    activo:          [true],
    especialidad:    [''],
    horarioInicio:   [''],
    horarioFin:      [''],
    fechaNacimiento: [''],
    objetivo:        [''],
    estadoFisico:    [''],
    rolNombre:       ['CLIENTE', Validators.required]
  });

  roles = ['CLIENTE', 'ENTRENADOR', 'ADMINISTRADOR'];

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading.set(true);
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar usuarios.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.isEditing.set(false);
    this.userForm.reset({ sexo: 'M', activo: true, rolNombre: 'CLIENTE' });
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }
  

  openEdit(usuario: Usuario): void {
    this.isEditing.set(true);
    this.selectedUser.set(usuario);
    this.userForm.patchValue({
      nombre:          usuario.nombre,
      correo:          usuario.correo,
      telefono:        usuario.telefono || '',
      sexo:            usuario.sexo || 'M',
      peso:            usuario.peso as any,
      estatura:        usuario.estatura as any,
      activo:          usuario.activo ?? true,
      especialidad:    usuario.especialidad || '',
      horarioInicio:   usuario.horarioInicio || '',
      horarioFin:      usuario.horarioFin || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      objetivo:        usuario.objetivo || '',
      estadoFisico:    usuario.estadoFisico || '',
      rolNombre:       usuario.rol?.nombre || 'CLIENTE'
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  openDelete(usuario: Usuario): void {
    this.selectedUser.set(usuario);
    this.showDeleteModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedUser.set(null);
    this.userForm.enable();
    
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  openDetails(usuario: Usuario): void {
    this.isEditing.set(false);
    this.selectedUser.set(usuario);

    // Llenamos el formulario con los datos del usuario
    this.userForm.patchValue({
      nombre:          usuario.nombre,
      correo:          usuario.correo,
      telefono:        usuario.telefono || '',
      sexo:            usuario.sexo || 'M',
      peso:            usuario.peso as any,
      estatura:        usuario.estatura as any,
      activo:          usuario.activo ?? true,
      especialidad:    usuario.especialidad || '',
      horarioInicio:   usuario.horarioInicio || '',
      horarioFin:      usuario.horarioFin || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      objetivo:        usuario.objetivo || '',
      estadoFisico:    usuario.estadoFisico || '',
      rolNombre:       usuario.rol?.nombre || ''
    });
    this.userForm.disable(); 
    
    this.showModal.set(true);
  }

 onSubmit(): void {
    if (this.userForm.invalid) return;

    const val = this.userForm.value;
    
    const rolId = val.rolNombre === 'ADMINISTRADOR' ? 3 :
                  val.rolNombre === 'ENTRENADOR' ? 2 : 1;

    const payload: Usuario = {
      nombre:          val.nombre!,
      correo:          val.correo!,
      telefono:        val.telefono || undefined,
      sexo:            val.sexo || undefined,
      peso:            val.peso || undefined,
      estatura:        val.estatura || undefined,
      activo:          val.activo ?? true,
      especialidad:    val.especialidad || undefined,
      horarioInicio:   val.horarioInicio || undefined,
      horarioFin:      val.horarioFin || undefined,
      fechaNacimiento: val.fechaNacimiento || undefined,
      objetivo:        val.objetivo || undefined,
      estadoFisico:    val.estadoFisico || undefined,
      rol:             { rolId: rolId, nombre: val.rolNombre! }
    };

    if (val.password) payload.password = val.password;

    if (this.isEditing()) {
      const id = this.selectedUser()!.usuarioId!;
      this.usuarioService.editar(id, payload).subscribe({
        next: () => {
          this.showSuccess('Usuario actualizado correctamente.');
          this.loadUsuarios();
          this.closeModal();
        },
        error: () => this.errorMsg.set('Error al actualizar usuario.')
      });
    } else {
      this.usuarioService.crear(payload).subscribe({
        next: () => {
          this.showSuccess('Usuario creado correctamente.');
          this.loadUsuarios();
          this.closeModal();
        },
        error: () => this.errorMsg.set('Error al crear usuario.')
      });
    }
  }


  confirmDelete(): void {
    const id = this.selectedUser()!.usuarioId!;
    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.showSuccess('Usuario eliminado correctamente.');
        this.loadUsuarios();
        this.closeDeleteModal();
      },
      error: () => this.errorMsg.set('Error al eliminar usuario.')
    });
  }

  getRolColor(rol: string): string {
    switch (rol) {
      case 'ADMINISTRADOR': return '#dc3545';
      case 'ENTRENADOR':    return '#f39c12';
      case 'CLIENTE':       return '#0d6efd';
      default:              return '#6c757d';
    }
  }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    this.errorMsg.set('');
    setTimeout(() => this.successMsg.set(''), 3000);
  }
}
