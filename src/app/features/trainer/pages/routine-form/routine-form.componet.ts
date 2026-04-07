import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RutinaService } from '../../../../core/services/rutina.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.scss']
})
export class RoutineFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rutinaService = inject(RutinaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMsg = signal('');

  rutinaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    objetivo: ['general'],
    nivel: ['principiante']
  });

  ngOnInit() {}

  onSubmit() {
    if (this.rutinaForm.invalid) {
      this.errorMsg.set('Complete el nombre de la rutina');
      return;
    }

    const formValue = this.rutinaForm.value;
    const userId = this.auth.user()?.usuarioId;

    if (!userId) {
      this.errorMsg.set('Usuario no autenticado');
      return;
    }

    const nuevaRutina = {
      nombre: formValue.nombre || '',
      descripcion: formValue.descripcion || '',
      objetivo: formValue.objetivo || 'general',
      nivel: formValue.nivel || 'principiante',
      activo: true,
      estaActiva: true,
      creadorId: userId,
      clienteId: null
    };

    console.log('Enviando rutina:', nuevaRutina);

    this.isLoading.set(true);
    this.rutinaService.crearRutina(nuevaRutina).subscribe({
      next: (response) => {
        console.log('Rutina creada:', response);
        this.isLoading.set(false);
        this.router.navigate(['/trainer/rutinas']);
      },
      error: (err) => {
        console.error('Error al crear rutina:', err);
        this.errorMsg.set('Error al crear la rutina');
        this.isLoading.set(false);
      }
    });
  }
}