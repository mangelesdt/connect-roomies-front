import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type AmenityKey =
  | 'wifi'
  | 'airConditioning'
  | 'heating'
  | 'parking'
  | 'tv'
  | 'furnished';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './publish.html',
  styleUrls: ['./publish.css']
})
export class PublishComponent {
  publishForm: FormGroup;
  selectedFiles: File[] = [];

  housingTypes = [
    { value: 'habitacion', label: 'publish.options.housingType.room' },
    { value: 'piso', label: 'publish.options.housingType.flat' },
    { value: 'apartamento', label: 'publish.options.housingType.apartment' },
    { value: 'casa', label: 'publish.options.housingType.house' }
  ];

  zones = [
    { value: 'centro', label: 'publish.options.zone.center' },
    { value: 'norte', label: 'publish.options.zone.north' },
    { value: 'sur', label: 'publish.options.zone.south' },
    { value: 'este', label: 'publish.options.zone.east' },
    { value: 'oeste', label: 'publish.options.zone.west' }
  ];

  amenities: { key: AmenityKey; label: string }[] = [
    { key: 'wifi', label: 'publish.options.amenities.wifi' },
    { key: 'airConditioning', label: 'publish.options.amenities.airConditioning' },
    { key: 'heating', label: 'publish.options.amenities.heating' },
    { key: 'parking', label: 'publish.options.amenities.parking' },
    { key: 'tv', label: 'publish.options.amenities.tv' },
    { key: 'furnished', label: 'publish.options.amenities.furnished' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.publishForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      housingType: ['', Validators.required],
      zone: ['', Validators.required],
      address: ['', [Validators.maxLength(150)]],

      rooms: [1, [Validators.required, Validators.min(1)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      size: [50, [Validators.required, Validators.min(1)]],
      price: [450, [Validators.required, Validators.min(1)]],
      availableFrom: ['', Validators.required],

      amenities: this.fb.group({
        wifi: [false],
        airConditioning: [false],
        heating: [false],
        parking: [false],
        tv: [false],
        furnished: [false]
      }),

      description: ['', [Validators.required, Validators.maxLength(1000)]],
      rules: ['', [Validators.maxLength(500)]],

      contactName: ['', [Validators.required, Validators.maxLength(80)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]{7,20}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
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

  goHome(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.publishForm.invalid) {
      this.publishForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.publishForm.value,
      images: this.selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
  }
}