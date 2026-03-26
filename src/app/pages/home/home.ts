import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Vivienda } from '../../core/interfaces/vivienda.interface';
import { ViviendaService } from '../../core/services/vivienda.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  filtroForm: FormGroup;
  loading = false;
  errorMessage = '';
  viviendas: Vivienda[] = [];
  viviendasFiltradas: Vivienda[] = [];

  constructor(
      private fb: FormBuilder,
      private viviendaService: ViviendaService) {
    this.filtroForm = this.fb.group({
      ciudad: [''],
      precioMax: [''],
      tipo: [''],
      ordenar: ['recientes']
    });

    this.viviendasFiltradas = this.viviendas;

    this.filtroForm.valueChanges.subscribe(() => {
      this.filtrar();
    });
  }
  ngOnInit(): void {
    this.cargarViviendas();
  }

  cargarViviendas(): void {
    this.loading = true;
    this.errorMessage = '';

    this.viviendaService.getViviendas().subscribe({
      next: (data) => {
        this.viviendas = data.filter(v => v.disponible === 1);
        this.viviendasFiltradas = [...this.viviendas];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error cargando viviendas';
        this.loading = false;
      }
    });
  }

  filtrar() {
    const { ciudad, precioMax, tipo, ordenar } = this.filtroForm.value;

    let resultado = this.viviendas.filter(v =>
      (!ciudad || v.localidad.toLowerCase().includes(ciudad.toLowerCase())) &&
      (!precioMax || v.precio <= precioMax) &&
      (!tipo || v.tipo === tipo)
    );

    if (ordenar === 'precio-asc') resultado.sort((a, b) => a.precio - b.precio);
    if (ordenar === 'precio-desc') resultado.sort((a, b) => b.precio - a.precio);
    if (ordenar === 'recientes') resultado.sort((a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );

    this.viviendasFiltradas = resultado;

  }
}