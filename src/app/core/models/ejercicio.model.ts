// Modelo para ExerciseDB API pública
export interface EjercicioPublico {
  exerciseId: string;
  name: string;
  imageUrl?: string;
  videoUrl?: string;
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  instructions?: string[];
}

export interface ExerciseDBResponse {
  data: EjercicioPublico[];
  totalPages?: number;
  currentPage?: number;
  nextPage?: string;
  previousPage?: string;
}
