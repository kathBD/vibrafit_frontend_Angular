import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  rutinaForm!: FormGroup;
  isEditing = signal(false);
  rutinaId = signal<number | null>(null);
  isLoading = signal(false);

  ejerciciosDisponibles = signal<any[]>([]);
  ejerciciosSeleccionados = signal<any[]>([]);
  clientes = signal<any[]>([]);

  ngOnInit() {
    this.initForm();
    this.cargarEjerciciosDisponibles();
    this.cargarClientes();

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
      clienteId: [null]
    });
  }

  cargarClientes() {
    this.usuarioService.getUsuariosPorRol('CLIENTE').subscribe({
      next: (data: any[]) => {
        this.clientes.set(data);
        console.log('✅ Clientes cargados:', data.length);
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  cargarEjerciciosDisponibles() {
    const token = this.authService.getToken();
    console.log('🔍 Cargando ejercicios...');
    
    this.http.get<any[]>('http://localhost:8080/api/exercises', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        console.log('✅ Ejercicios cargados:', data.length);
        this.ejerciciosDisponibles.set(data);
      },
      error: (err) => console.error('Error cargando ejercicios:', err)
    });
  }

  // 🔥 NUEVO MÉTODO - Agregar ejercicio por ID (para usar con el botón)
agregarEjercicioPorId(ejercicioId: string) {
  console.log('ID recibido:', ejercicioId);
  
  if (!ejercicioId) return;

  const ejercicio = this.ejerciciosDisponibles().find(
    e => String(e.id) === String(ejercicioId)
  );

  console.log('Ejercicio encontrado:', ejercicio);

  if (!ejercicio) return;

  const nuevoEjercicio = {
    ejercicioId: String(ejercicio.id),
    nombre: ejercicio.name,
    series: 3,
    repeticiones: 10,
    orden: this.ejerciciosSeleccionados().length + 1,
    descanso: 60,
    peso: 0
  };

  console.log('Nuevo ejercicio:', nuevoEjercicio);
  this.ejerciciosSeleccionados.update(prev => [...prev, nuevoEjercicio]);
  console.log('Signal después:', this.ejerciciosSeleccionados());
}



  // Método original (lo mantienes por si acaso)
  agregarEjercicio(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.agregarEjercicioPorId(select.value);
  }

  actualizarEjercicio(index: number, campo: string, valor: number) {
    this.ejerciciosSeleccionados.update(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: Number(valor) };
      return copia;
    });
  }

  eliminarEjercicio(index: number) {
    this.ejerciciosSeleccionados.update(prev =>
      prev.filter((_, i) => i !== index).map((e, i) => ({ ...e, orden: i + 1 }))
    );
  }

  cargarRutina(id: number) {
    this.isLoading.set(true);
    console.log('🔍 Cargando rutina ID:', id);
    
    this.http.get<any>(`http://localhost:8080/api/rutinas/${id}`).subscribe({
      next: (data) => {
        console.log('📦 Datos completos del backend:', data);
        
        this.rutinaForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          objetivo: data.objetivo,
          nivel: data.nivel,
          duracionMinutos: data.duracionMinutos,
          diaSemana: data.diaSemana,
          activo: data.activo,
          estaActiva: data.estaActiva,
          clienteId: data.clienteId
        });
        
        let ejercicios = data.ejercicios || data.ejerciciosRutina || [];
        console.log('📊 Ejercicios encontrados:', ejercicios.length);
        
        if (ejercicios.length > 0) {
          const ejerciciosFormateados = ejercicios.map((e: any, idx: number) => ({
            ejercicioId: e.ejercicioId || e.ejercicio?.id,
            nombre: e.nombre || e.ejercicio?.name || 'Ejercicio',
            series: e.series || 3,
            repeticiones: e.repeticiones || 10,
            orden: idx + 1,
            descanso: e.descanso || 60,
            peso: e.peso || 0
          }));
          
          this.ejerciciosSeleccionados.set(ejerciciosFormateados);
          console.log('✅ Ejercicios formateados:', this.ejerciciosSeleccionados().length);
        } else {
          this.ejerciciosSeleccionados.set([]);
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando rutina:', err);
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
    const creadorId = usuario?.usuarioId;
    
    if (!creadorId) {
      alert('No se pudo identificar al creador');
      this.isLoading.set(false);
      return;
    }

    const clienteIdRaw = this.rutinaForm.get('clienteId')?.value;
    const clienteId = clienteIdRaw ? Number(clienteIdRaw) : null;

    const rutinaData = {
      nombre: this.rutinaForm.get('nombre')?.value || '',
      descripcion: this.rutinaForm.get('descripcion')?.value || '',
      objetivo: this.rutinaForm.get('objetivo')?.value || 'General',
      nivel: this.rutinaForm.get('nivel')?.value || 'Principiante',
      duracionMinutos: Number(this.rutinaForm.get('duracionMinutos')?.value) || 60,
      diaSemana: this.rutinaForm.get('diaSemana')?.value || 'Lunes',
      creadorId: Number(creadorId),
      clienteId: clienteId,
      ejercicios: this.ejerciciosSeleccionados().map(e => ({
        ejercicioId: String(e.ejercicioId),
        series: Number(e.series),
        repeticiones: Number(e.repeticiones),
        orden: Number(e.orden),
        descanso: Number(e.descanso) || 60,
        peso: Number(e.peso) || 0
      }))
    };

    console.log('📤 Enviando:', JSON.stringify(rutinaData, null, 2));

    const token = this.authService.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

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
