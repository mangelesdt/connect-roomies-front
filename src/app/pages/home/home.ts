import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

interface Vivienda {
  id: number;
  titulo: string;
  ciudad: string;
  precio: number;
  tipo: string;
  imagen: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  filtroForm: FormGroup;

  viviendas: Vivienda[] = [
  {
    id: 1,
    titulo: 'Apartamento moderno',
    ciudad: 'Madrid',
    precio: 750,
    tipo: 'Apartamento',
    imagen: 'assets/images/house1.jpg'
  },
  {
    id: 2,
    titulo: 'Piso céntrico',
    ciudad: 'Barcelona',
    precio: 900,
    tipo: 'Piso',
    imagen: 'assets/images/house2.jpg'
  }
];

  viviendasFiltradas: Vivienda[] = [];

  constructor(private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      ciudad: [''],
      precioMax: [''],
      tipo: ['']
    });

    this.viviendasFiltradas = this.viviendas;

    this.filtroForm.valueChanges.subscribe(() => {
      this.filtrar();
    });
  }

  filtrar() {
    const { ciudad, precioMax, tipo } = this.filtroForm.value;

    this.viviendasFiltradas = this.viviendas.filter(v => {
      return (
        (!ciudad || v.ciudad.toLowerCase().includes(ciudad.toLowerCase())) &&
        (!precioMax || v.precio <= precioMax) &&
        (!tipo || v.tipo === tipo)
      );
    });
  }
}