export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = 'ADMIN' | 'USUARIO' | 'PROPIETARIO';

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
  rol?: UserRole;
}