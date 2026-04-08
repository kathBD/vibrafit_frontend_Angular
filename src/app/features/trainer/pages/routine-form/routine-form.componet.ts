import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ExerciseService, Exercise } from '../../../../core/services/exercise.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.scss']
})
export class RoutineFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private exerciseService = inject(ExerciseService);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  rutinaForm!: FormGroup;
  isEditing = signal(false);
  rutinaId = signal<number | null>(null);
  isLoading = signal(false);

  ejerciciosDisponibles = signal<Exercise[]>([]);
  isLoadingEjercicios = signal(false);
  ejerciciosSeleccionados = signal<any[]>([]);
  
  clientes = signal<any[]>([]);  // ← Signal para clientes

  ngOnInit() {
    this.initForm();
    this.cargarEjerciciosDisponibles();
    this.cargarClientes();  // ← Llamar aquí

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.rutinaId.set(+id);
      this.cargarRutina(+id);
    }
  }

  initForm() {
    this.rutinaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      objetivo: ['General'],
      nivel: ['Principiante'],
      duracionMinutos: [60],
      diaSemana: ['Lunes'],
      activo: [true],
      estaActiva: [true],
      clienteId: [null]  // ← Campo para cliente
    });
  }

  // 🔥 MÉTODO CARGAR CLIENTES - Aquí debe estar
  cargarClientes() {
    this.usuarioService.getUsuariosPorRol('CLIENTE').subscribe({
      next: (data: any[]) => {
        this.clientes.set(data);
        console.log('✅ Clientes cargados:', data);
      },
      error: (err: any) => {
        console.error('Error cargando clientes:', err);
      }
    });
  }

  cargarEjerciciosDisponibles() {
    this.isLoadingEjercicios.set(true);
    this.exerciseService.getAllExercises().subscribe({
      next: (data) => {
        this.ejerciciosDisponibles.set(data);
        this.isLoadingEjercicios.set(false);
      },
      error: (err) => {
        console.error('Error cargando ejercicios:', err);
        this.isLoadingEjercicios.set(false);
        alert('Error al cargar ejercicios');
      }
    });
  }

  agregarEjercicio(event: Event) {
    const select = event.target as HTMLSelectElement;
    const ejercicioId = select.value;

    if (!ejercicioId) {
      alert('Selecciona un ejercicio');
      return;
    }

    const ejercicio = this.ejerciciosDisponibles().find(e => e.id === ejercicioId);

    if (ejercicio) {
      const nuevoEjercicio = {
        ejercicioId: ejercicio.id,
        nombre: ejercicio.name,
        series: 3,
        repeticiones: 10,
        orden: this.ejerciciosSeleccionados().length + 1,
        descanso: 60,
        duracion: 0,
        peso: 0
      };

      this.ejerciciosSeleccionados.update(prev => [...prev, nuevoEjercicio]);
      select.value = '';
    }
  }

  eliminarEjercicio(index: number) {
    this.ejerciciosSeleccionados.update(prev => {
      const nuevos = [...prev];
      nuevos.splice(index, 1);
      nuevos.forEach((e, i) => e.orden = i + 1);
      return nuevos;
    });
  }

  actualizarEjercicio(index: number, campo: string, valor: any) {
    this.ejerciciosSeleccionados.update(prev => {
      const nuevos = [...prev];
      nuevos[index][campo] = valor;
      return nuevos;
    });
  }

  cargarRutina(id: number) {
    this.isLoading.set(true);
    this.http.get(`http://localhost:8080/api/rutinas/${id}`).subscribe({
      next: (data: any) => {
        this.rutinaForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          objetivo: data.objetivo,
          nivel: data.nivel,
          duracionMinutos: data.duracionMinutos,
          diaSemana: data.diaSemana,
          activo: data.activo,
          estaActiva: data.estaActiva,
          clienteId: data.clienteId || null
        });

        if (data.ejercicios && data.ejercicios.length > 0) {
          this.ejerciciosSeleccionados.set(
            data.ejercicios.map((e: any, i: number) => ({
              ...e,
              descanso: e.descanso ?? 60,
              duracion: e.duracion ?? 0,
              orden: i + 1
            }))
          );
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando rutina:', err);
        this.isLoading.set(false);
        alert('Error al cargar la rutina');
      }
    });
  }

  guardarRutina() {
    if (this.rutinaForm.invalid) {
      alert('Completa los campos requeridos');
      return;
    }

    if (this.ejerciciosSeleccionados().length === 0) {
      alert('Agrega al menos un ejercicio');
      return;
    }

    this.isLoading.set(true);

    const usuario = this.authService.getUser();
    const userRole = this.authService.rolNormalizado();
    let creadorId = usuario?.usuarioId;

    if (userRole === 'ADMIN') {
      console.log('👑 ADMIN creando rutina');
      if (!creadorId) {
        creadorId = 1;
      }
    }

    if (!creadorId) {
      alert('No se pudo identificar al creador de la rutina');
      this.isLoading.set(false);
      return;
    }

    const rutinaData = {
      nombre: this.rutinaForm.get('nombre')?.value,
      descripcion: this.rutinaForm.get('descripcion')?.value,
      objetivo: this.rutinaForm.get('objetivo')?.value,
      nivel: this.rutinaForm.get('nivel')?.value,
      duracionMinutos: this.rutinaForm.get('duracionMinutos')?.value,
      diaSemana: this.rutinaForm.get('diaSemana')?.value,
      creadorId: creadorId,
      clienteId: this.rutinaForm.get('clienteId')?.value,  // ← Incluir cliente
      ejercicios: this.ejerciciosSeleccionados().map(e => ({
        ejercicioId: e.ejercicioId,
        series: e.series,
        repeticiones: e.repeticiones,
        orden: e.orden,
        descanso: e.descanso,
        peso: e.peso || 0
      }))
    };

    console.log('📤 Enviando:', JSON.stringify(rutinaData, null, 2));

    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    this.http.post('http://localhost:8080/api/rutinas/guardar-con-ejercicios', rutinaData, { headers }).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('✅ Rutina guardada exitosamente');
        this.router.navigate(['/trainer/rutinas']);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.isLoading.set(false);
        alert('❌ Error: ' + (err.error?.message || err.message));
      }
    });
  }
}