export interface Propietario {
  id: number;
  nombre: string;
  email: string;
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
  imagenesVivienda: ImagenVivienda[];
}

export interface ImagenVivienda {
  id: number;
  urlImg: string;
}