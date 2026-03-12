import { Usuario } from './usuario.model';

export type NivelRutina   = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
export type ObjetivoRutina = 'FUERZA' | 'CARDIO' | 'FLEXIBILIDAD' | 'PERDIDA_PESO' | 'GANANCIA_MUSCULAR';

export interface Rutina {
  rutinaId?: number;
  nombre: string;
  descripcion?: string;
  nivel: NivelRutina;
  objetivo: ObjetivoRutina;
  duracionMinutos?: number;
  diasSemana?: string;
  activa?: boolean;
  fechaCreacion?: string;
  usuario?: Pick<Usuario, 'usuarioId' | 'nombre' | 'correo'>;
}
