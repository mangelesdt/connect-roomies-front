export type Comodidad =
  | 'WIFI'
  | 'AIR'
  | 'CALEFACCION'
  | 'PARKING'
  | 'TV'
  | 'AMUEBLADO';

export interface Propietario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface Vivienda {
  id: number;
  titulo: string;
  tipo: string;
  direccion: string;
  localidad: string;
  provincia: string;
  precio: number;
  disponible: number;
  fechaCreacion: string;
  descripcion?: string;
  metros?: number;
  banos?: number;
  habitacionesTotales?: number;
  normas?: string;
  comodidades?: Comodidad[];
  propietario?: Propietario;
  imagenesVivienda: ImagenVivienda[];
}

export interface ImagenVivienda {
  id: number;
  urlImg: string;
}