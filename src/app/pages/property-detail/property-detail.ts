import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ViviendaService } from '../../core/services/vivienda.service';
import { AuthService } from '../../core/services/auth.service';
import { AlquilerService } from '../../core/services/alquiler.service';

import { Comodidad, Vivienda } from '../../core/interfaces/vivienda.interface';
import { RegistrarAlquilerRequest } from '../../core/interfaces/alquiler.interface';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetailComponent implements OnInit {
  vivienda: Vivienda | null = null;
  viviendaId!: number;
  loading = false;
  errorMessage = '';
  imagenSeleccionada = 0;

  mostrarPopupSolicitud = false;
  enviandoSolicitud = false;
  solicitudError = '';
  solicitudOk = '';

  formularioSolicitud = {
    mensaje: '',
    fechaEntrada: '',
    duracionMeses: 6
  };

  amenityLabels: Record<Comodidad, string> = {
    WIFI: 'propertyDetail.amenities.wifi',
    AIR: 'propertyDetail.amenities.airConditioning',
    CALEFACCION: 'propertyDetail.amenities.heating',
    PARKING: 'propertyDetail.amenities.parking',
    TV: 'propertyDetail.amenities.tv',
    AMUEBLADO: 'propertyDetail.amenities.furnished'
  };

  amenityIcons: Record<Comodidad, string> = {
    WIFI: 'assets/images/wifi.png',
    AIR: 'assets/images/air.png',
    CALEFACCION: 'assets/images/calefaccion.png',
    PARKING: 'assets/images/parking.png',
    TV: 'assets/images/tv.png',
    AMUEBLADO: 'assets/images/amueblado.png'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viviendaService: ViviendaService,
    private authService: AuthService,
    private alquilerService: AlquilerService
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
    if (this.vivienda?.imagenesVivienda && this.vivienda.imagenesVivienda.length > 0) {
      return (
        this.vivienda.imagenesVivienda[this.imagenSeleccionada]?.urlImg ||
        this.vivienda.imagenesVivienda[0].urlImg
      );
    }

    return 'assets/images/house-placeholder.jpg';
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

  get esUsuario(): boolean {
    return this.authService.isArrendatario();
  }

  get usuarioLogueado(): boolean {
    return this.authService.isLogged();
  }

  abrirPopupSolicitud(): void {
    this.solicitudError = '';
    this.solicitudOk = '';

    if (!this.usuarioLogueado || !this.esUsuario) {
      this.solicitudError = 'Solo los usuarios de tipo USUARIO pueden enviar solicitudes.';
      return;
    }

    this.mostrarPopupSolicitud = true;
  }

  cerrarPopupSolicitud(): void {
    if (this.enviandoSolicitud) return;

    this.mostrarPopupSolicitud = false;
    this.solicitudError = '';
    this.solicitudOk = '';
  }

  enviarSolicitud(): void {
    this.solicitudError = '';
    this.solicitudOk = '';

    if (!this.vivienda) {
      this.solicitudError = 'No se ha encontrado la vivienda.';
      return;
    }

    if (!this.formularioSolicitud.mensaje.trim()) {
      this.solicitudError = 'Debes escribir un mensaje para el propietario.';
      return;
    }

    if (!this.formularioSolicitud.fechaEntrada) {
      this.solicitudError = 'Debes indicar la fecha de entrada deseada.';
      return;
    }

    if (!this.formularioSolicitud.duracionMeses || this.formularioSolicitud.duracionMeses < 1) {
      this.solicitudError = 'La duración del alquiler debe ser válida.';
      return;
    }

    const fechaInicio = this.toLocalDateTimeStart(this.formularioSolicitud.fechaEntrada);
    const fechaFin = this.calcularFechaFin(this.formularioSolicitud.fechaEntrada, this.formularioSolicitud.duracionMeses);

    const payload: RegistrarAlquilerRequest = {
      viviendaId: this.vivienda.id,
      fechaInicio,
      fechaFin,
      mensaje: this.formularioSolicitud.mensaje.trim(),
      duracionMeses: this.formularioSolicitud.duracionMeses
    };

    this.enviandoSolicitud = true;

    this.alquilerService.crearSolicitud(payload).subscribe({
      next: () => {
        this.enviandoSolicitud = false;
        this.solicitudOk = 'Solicitud enviada correctamente.';
        this.mostrarPopupSolicitud = false;

        this.formularioSolicitud = {
          mensaje: '',
          fechaEntrada: '',
          duracionMeses: 6
        };
      },
      error: (error) => {
      this.enviandoSolicitud = false;

      this.solicitudError =
        error?.error?.message ||
        error?.error ||
        error?.message ||
        'No se pudo enviar la solicitud de alquiler.';
    }
    });
  }

  private toLocalDateTimeStart(fecha: string): string {
    return `${fecha}T00:00:00`;
  }

  private calcularFechaFin(fechaInicio: string, meses: number): string {
    const fecha = new Date(`${fechaInicio}T00:00:00`);
    fecha.setMonth(fecha.getMonth() + meses);
    return fecha.toISOString().slice(0, 19);
  }
}