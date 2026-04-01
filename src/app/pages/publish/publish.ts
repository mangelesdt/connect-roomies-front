import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ViviendaService } from '../../core/services/vivienda.service';

type AmenityKey =
  | 'wifi'
  | 'airConditioning'
  | 'heating'
  | 'parking'
  | 'tv'
  | 'furnished';

type Comodidad =
  | 'WIFI'
  | 'AIR'
  | 'CALEFACCION'
  | 'PARKING'
  | 'TV'
  | 'AMUEBLADO';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './publish.html',
  styleUrls: ['./publish.css']
})
export class PublishComponent implements OnInit {
  publishForm: FormGroup;
  selectedFiles: File[] = [];
  loading = false;
  errorMessage = '';
  isEditMode = false;
  viviendaId!: number;

  housingTypes = [
    { value: 'Habitación', label: 'publish.housingType.room' },
    { value: 'Piso', label: 'publish.housingType.flat' },
    { value: 'Apartamento', label: 'publish.housingType.apartment' },
    { value: 'Casa', label: 'publish.housingType.house' }
  ];

  amenities: { key: AmenityKey; label: string }[] = [
    { key: 'wifi', label: 'publish.amenities.wifi' },
    { key: 'airConditioning', label: 'publish.amenities.airConditioning' },
    { key: 'heating', label: 'publish.amenities.heating' },
    { key: 'parking', label: 'publish.amenities.parking' },
    { key: 'tv', label: 'publish.amenities.tv' },
    { key: 'furnished', label: 'publish.amenities.furnished' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private viviendaService: ViviendaService,
    private route: ActivatedRoute
  ) {
    this.publishForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      housingType: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required, Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.maxLength(10)]],

      rooms: [1, [Validators.required, Validators.min(1)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      size: [50, [Validators.required, Validators.min(1)]],
      price: [450, [Validators.required, Validators.min(1)]],

      amenities: this.fb.group({
        wifi: [false],
        airConditioning: [false],
        heating: [false],
        parking: [false],
        tv: [false],
        furnished: [false]
      }),

      description: ['', [Validators.required, Validators.maxLength(1000)]],
      rules: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.viviendaId = Number(idParam);
      this.cargarViviendaParaEditar();
    }
  }

  get amenitiesGroup(): FormGroup {
    return this.publishForm.get('amenities') as FormGroup;
  }

  toggleAmenity(key: AmenityKey): void {
    const control = this.amenitiesGroup.get(key) as FormControl;
    control.setValue(!control.value);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.selectedFiles = Array.from(input.files);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  private mapAmenitiesToBackend(): Comodidad[] {
    const amenities = this.publishForm.value.amenities;
    const result: Comodidad[] = [];

    if (amenities?.wifi) result.push('WIFI');
    if (amenities?.airConditioning) result.push('AIR');
    if (amenities?.heating) result.push('CALEFACCION');
    if (amenities?.parking) result.push('PARKING');
    if (amenities?.tv) result.push('TV');
    if (amenities?.furnished) result.push('AMUEBLADO');

    return result;
  }

  onSubmit(): void {
    if (this.publishForm.invalid) {
      this.publishForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      titulo: this.publishForm.value.title,
      tipo: this.publishForm.value.housingType,
      direccion: this.publishForm.value.address,
      localidad: this.publishForm.value.city,
      provincia: this.publishForm.value.province,
      codigoPostal: this.publishForm.value.postalCode,
      precio: Number(this.publishForm.value.price),
      disponible: 1,
      descripcion: this.publishForm.value.description,
      metros: Number(this.publishForm.value.size),
      banos: Number(this.publishForm.value.bathrooms),
      habitacionesTotales: Number(this.publishForm.value.rooms),
      normas: this.publishForm.value.rules || '',
      comodidades: this.mapAmenitiesToBackend(),
      imagenesVivienda: this.selectedFiles.map(file => ({
        urlImg: `assets/images/${file.name}`
      }))
    };

    const request$ = this.isEditMode
        ? this.viviendaService.updateVivienda(this.viviendaId, payload)
        : this.viviendaService.createVivienda(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        if(this.isEditMode) {
          this.router.navigate(['/perfil']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = this.isEditMode ? 'Error al actualizar la vivienda' : 'Error al publicar la vivienda';
      }
    });
  }

  private cargarViviendaParaEditar(): void {
    this.loading = true;
    this.errorMessage = '';

    this.viviendaService.getViviendaById(this.viviendaId).subscribe({
      next: (vivienda) => {
        this.profileToForm(vivienda);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se ha podido cargar la vivienda';
        this.loading = false;
      }
    });
  }

  private profileToForm(vivienda: any): void {
    this.publishForm.patchValue({
      title: vivienda.titulo ?? '',
      housingType: vivienda.tipo ?? '',
      address: vivienda.direccion ?? '',
      city: vivienda.localidad ?? '',
      province: vivienda.provincia ?? '',
      postalCode: vivienda.codigoPostal ?? '',
      rooms: vivienda.habitacionesTotales ?? 1,
      bathrooms: vivienda.banos ?? 1,
      size: vivienda.metros ?? 1,
      price: vivienda.precio ?? 1,
      description: vivienda.descripcion ?? '',
      rules: vivienda.normas ?? ''
    });

    this.marcarComodidades(vivienda.comodidades ?? []);
  }

  private marcarComodidades(comodidades: string[]): void {
    const amenitiesGroup = this.publishForm.get('amenities') as FormGroup;

    amenitiesGroup.patchValue({
      wifi: comodidades.includes('WIFI'),
      airConditioning: comodidades.includes('AIR'),
      heating: comodidades.includes('CALEFACCION'),
      parking: comodidades.includes('PARKING'),
      tv: comodidades.includes('TV'),
      furnished: comodidades.includes('AMUEBLADO')
    });
  }
}