export interface RegistrarAlquilerRequest {
  fechaInicio: string;
  fechaFin: string;
  viviendaId?: number;
  habitacionId?: number;
  mensaje?: string;
  duracionMeses?: number;
}

export interface AlquilerResponse {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  mensaje?: string;
  duracionMeses?: number;
}

export interface AlquilerOwnerItem {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
  mensaje?: string;
  duracionMeses?: number;
  inquilino?: {
    id: number;
    nombre: string;
  };
  vivienda?: {
    id: number;
    titulo: string;
  };
  habitacion?: {
    id: number;
    nombre: string;
  };
}

export type SolicitudFiltro = 'TODAS' | 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';