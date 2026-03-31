import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/interfaces/user.interface';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId!: number;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]{7,20}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();

    if (!currentUser?.id) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.userId = currentUser.id;
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getProfile(this.userId).subscribe({
      next: (user: UserProfile) => {
        this.profileForm.patchValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          telefono: user.telefono,
          email: user.email
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se ha podido cargar el perfil';
        this.loading = false;
      }
    });
  }

  guardar(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    this.authService.updateProfile(this.userId, this.profileForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.loading = false;
        this.successMessage = this.translate.instant('profile.messages.saveSuccess');
        this.router.navigate(['/perfil']);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'No se ha podido actualizar el perfil';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/perfil']);
  }
}