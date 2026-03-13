// src/app/features/trainer/pages/client-list/client-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Lista de Clientes</h2>
      <p>Aquí irá la lista de clientes asignados</p>
    </div>
  `,
  styles: [`
    .container { color: white; }
  `]
})
export class ClientListComponent {}
