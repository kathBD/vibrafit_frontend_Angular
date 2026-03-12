import { Usuario } from './usuario.model';

// ── Request ──────────────────────────────────
export interface LoginRequest {
  correo: string;
  password: string;
}

// ── Response ─────────────────────────────────
export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
