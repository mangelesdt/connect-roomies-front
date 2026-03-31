export interface UserProfile {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  estado?: string;
  roles?: UserRole;
}

export type UserRole = 'ADMIN' | 'USUARIO' | 'PROPIETARIO';