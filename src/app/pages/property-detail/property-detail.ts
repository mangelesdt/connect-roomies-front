import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ViviendaService } from '../../core/services/vivienda.service';
import { Comodidad, Vivienda } from '../../core/interfaces/vivienda.interface';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetailComponent implements OnInit {
  vivienda: Vivienda | null = null;
  viviendaId!: number;

  loading = false;
  errorMessage = '';
  imagenSeleccionada = 0;

  amenityLabels: Record<Comodidad, string> = {
    WIFI: 'WiFi de alta velocidad',
    AIR: 'Aire acondicionado',
    CALEFACCION: 'Calefacción',
    PARKING: 'Parking disponible',
    TV: 'TV en habitación',
    AMUEBLADO: 'Completamente amueblada'
  };

  amenityIcons: Record<Comodidad, string> = {
    WIFI: '📶',
    AIR: '❄️',
    CALEFACCION: '♨️',
    PARKING: '🅿️',
    TV: '📺',
    AMUEBLADO: '🛏'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viviendaService: ViviendaService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(Number(idParam))) {
      this.errorMessage = 'Identificador de vivienda no válido';
      return;
    }

    this.viviendaId = Number(idParam);
    this.cargarVivienda();
  }

  cargarVivienda(): void {
    this.loading = true;
    this.errorMessage = '';

    this.viviendaService.getViviendaById(this.viviendaId).subscribe({
      next: (data) => {
        this.vivienda = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se ha podido cargar el detalle de la vivienda';
        this.loading = false;
      }
    });
  }

  seleccionarImagen(index: number): void {
    this.imagenSeleccionada = index;
  }

  get imagenPrincipal(): string {
    if (
      this.vivienda?.imagenesVivienda &&
      this.vivienda.imagenesVivienda.length > 0
    ) {
      return this.vivienda.imagenesVivienda[this.imagenSeleccionada]?.urlImg
        || this.vivienda.imagenesVivienda[0].urlImg;
    }

    return 'assets/images/house-placeholder.jpg';
  }

  contactar(): void {
    if (!this.vivienda) return;

    const email = this.vivienda.propietario?.email;
    if (email) {
      window.location.href = `mailto:${email}?subject=Interés en ${this.vivienda.titulo}`;
    }
  }

  get comodidadesMostrables(): Comodidad[] {
    return this.vivienda?.comodidades ?? [];
  }

  getAmenityLabel(key: Comodidad): string {
    return this.amenityLabels[key];
  }

  getAmenityIcon(key: Comodidad): string {
    return this.amenityIcons[key];
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}