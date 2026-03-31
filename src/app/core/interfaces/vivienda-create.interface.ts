export type Comodidad =
  | 'WIFI'
  | 'AIR'
  | 'CALEFACCION'
  | 'PARKING'
  | 'TV'
  | 'AMUEBLADO';

export interface ImagenViviendaCreate {
  urlImg: string;
}

export interface ViviendaCreateRequest {
  titulo: string;
  tipo: string;
  localidad: string;
  direccion: string;
  precio: number;
  descripcion: string;
  metros: number;
  banos: number;
  habitacionesTotales: number;
  normas: string;
  comodidades: Comodidad[];
  imagenesVivienda: ImagenViviendaCreate[];
}