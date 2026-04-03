export interface RegistrarAlquilerRequest {
  fechaInicio: string;
  fechaFin: string;
  viviendaId?: number;
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
  estado: EstadoSolicitud;
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
}

export type EstadoSolicitud = 'PENDIENTE' | 'RECHAZADO' | 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
export type SolicitudFiltro = 'TODAS' | 'PENDIENTE' | 'ACTIVO' | 'RECHAZADO';

export interface AlquilerUsuarioItem {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoSolicitud;
  vivienda?: {
    id: number;
    titulo: string;
  };
  habitacion?: {
    id: number;
    nombre: string;
  };
}