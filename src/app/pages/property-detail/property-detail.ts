import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type Amenity = {
  icon: string;
  label: string;
};

type Expense = {
  label: string;
  amount: string;
};

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetailComponent {
  propertyId: string | null = null;
  currentImageIndex = 0;

  property = {
    id: 1,
    typeLabel: 'propertyDetail.labels.room',
    statusLabel: 'propertyDetail.labels.available',
    title: 'propertyDetail.mock.title',
    location: 'propertyDetail.mock.location',
    price: '450€',
    period: '/mes',
    bedrooms: '1',
    bathrooms: '1',
    size: '25',
    availableDate: '1 de Septiembre 2024',
    description: 'propertyDetail.mock.description',
    ownerName: 'María González',
    responseTime: '1-2 horas',
    phone: '+34 600 123 456',
    email: 'maria.gonzalez@email.com',
    images: [
      'assets/images/house1.jpg',
      'assets/images/house2.jpg',
      'assets/images/house3.jpg',
      'assets/images/house4.jpg'
    ] as string[],
    amenities: [
      { icon: 'wifi', label: 'propertyDetail.amenities.wifi' },
      { icon: 'ac_unit', label: 'propertyDetail.amenities.airConditioning' },
      { icon: 'tv', label: 'propertyDetail.amenities.tv' },
      { icon: 'chair', label: 'propertyDetail.amenities.furnished' },
      { icon: 'local_parking', label: 'propertyDetail.amenities.parking' },
      { icon: 'mode_fan', label: 'propertyDetail.amenities.heating' }
    ] as Amenity[],
    expenses: [
      { label: 'propertyDetail.expenses.rent', amount: '450€' },
      { label: 'propertyDetail.expenses.services', amount: '50€' },
      { label: 'propertyDetail.expenses.internet', amount: '15€' },
      { label: 'propertyDetail.expenses.cleaning', amount: '20€' }
    ] as Expense[],
    totalMonthly: '535€',
    rules: [
      'propertyDetail.rules.rule1',
      'propertyDetail.rules.rule2',
      'propertyDetail.rules.rule3',
      'propertyDetail.rules.rule4'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.propertyId = this.route.snapshot.paramMap.get('id');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  setImage(index: number): void {
    this.currentImageIndex = index;
  }

  prevImage(): void {
    if (this.currentImageIndex === 0) {
      this.currentImageIndex = this.property.images.length - 1;
      return;
    }

    this.currentImageIndex--;
  }

  nextImage(): void {
    if (this.currentImageIndex === this.property.images.length - 1) {
      this.currentImageIndex = 0;
      return;
    }

    this.currentImageIndex++;
  }
}