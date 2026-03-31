import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ViviendaService } from '../../core/services/vivienda.service';
import { UserProfile } from '../../core/interfaces/user.interface';
import { Vivienda } from '../../core/interfaces/vivienda.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  isAdminView = false;
  isPropietarioView = false;
  isUsuarioView = false;

  user: UserProfile | null = null;
  users: UserProfile[] = [];
  misViviendas: Vivienda[] = [];

  userId!: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private viviendaService: ViviendaService,
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

    const role = this.authService.getRole();
    this.isAdminView = role === 'ADMIN';
    this.isPropietarioView = role === 'PROPIETARIO';
    this.isUsuarioView = role === 'USUARIO';

    if (this.isAdminView) {
      this.cargarUsuarios();
    } else if (this.isPropietarioView) {
      this.cargarPerfil();
      this.cargarMisViviendas();
    } else {
      this.cargarPerfil();
    }
  }

  cargarPerfil(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getProfile(this.userId).subscribe({
      next: (user) => {
        this.user = user;

        this.profileForm.patchValue({
          nombre: user.nombre,
          apellidos: user.apellidos,
          telefono: user.telefono,
          email: user.email
        });

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'error';
        this.loading = false;
      }
    });
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'error';
        this.loading = false;
      }
    });
  }

  cargarMisViviendas(): void {
    this.viviendaService.getMisViviendas(this.userId).subscribe({
      next: (data) => {
        this.misViviendas = data;
      },
      error: () => {}
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
      next: (updatedUser) => {
        this.user = updatedUser;
        this.saving = false;
        this.successMessage = this.translate.instant('profile.messages.saveSuccess');
        this.cargarPerfil();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'error';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getUserRole(user: UserProfile): string {
    const role = user.roles?.length ? user.roles[0] : '-';

    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'PROPIETARIO':
        return 'Propietario';
      case 'USUARIO':
        return 'Usuario';
      default: return role || '-';
    }
  }

  editarVivienda(id: number): void {
    this.router.navigate(['/publicar', id]);
  }

  eliminarVivienda(id: number): void {
    const confirmDelete = confirm('¿Seguro que quieres eliminar esta vivienda?');

    if (!confirmDelete) return;

    this.viviendaService.deleteVivienda(id).subscribe({
      next: () => {
        this.cargarMisViviendas();
      },
      error: () => {
        this.errorMessage = 'No se ha podido eliminar la vivienda';
      }
    });
  }

  irAEditarPerfil(): void {
    this.router.navigate(['/perfil/editar']);
  }
}