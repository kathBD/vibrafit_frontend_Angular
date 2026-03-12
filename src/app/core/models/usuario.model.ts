export interface Rol {
  rolId: number;
  nombre: string; // ADMINISTRADOR | ENTRENADOR | CLIENTE
}

export interface Usuario {
  usuarioId: number;
  correo: string;
  nombre: string;
  telefono?: string;
  sexo?: string;
  peso?: number;
  estatura?: number;
  activo: boolean;
  especialidad?: string;
  horarioInicio?: string;
  horarioFin?: string;
  fechaNacimiento?: string;
  fechaRegistro?: string;
  rol: Rol;
  objetivo?: string;
  estadoFisico?: string;
}

// Para crear/editar — password solo en escritura
export interface UsuarioForm extends Omit<Usuario, 'usuarioId' | 'fechaRegistro'> {
  usuarioId?: number;
  password?: string;
}
