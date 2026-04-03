import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ViviendaService } from '../../core/services/vivienda.service';
import { UserProfile } from '../../core/interfaces/user.interface';
import { Vivienda } from '../../core/interfaces/vivienda.interface';
import { AlquilerService } from '../../core/services/alquiler.service';
import { AlquilerOwnerItem, AlquilerUsuarioItem, SolicitudFiltro } from '../../core/interfaces/alquiler.interface';

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

  solicitudesAlquiler: AlquilerOwnerItem[] = [];
  solicitudesFiltradas: AlquilerOwnerItem[] = [];
  solicitudesLoading = false;
  solicitudesError = '';

  solicitudesAdmin: AlquilerOwnerItem[] = [];
  solicitudesAdminFiltradas: AlquilerOwnerItem[] = [];
  solicitudesAdminLoading = false;
  solicitudesAdminError = '';

  misSolicitudes: AlquilerUsuarioItem[] = [];
  misSolicitudesLoading = false;
  misSolicitudesError = '';

  filtroSolicitudes: SolicitudFiltro = 'TODAS';

  readonly filtrosSolicitud: { key: SolicitudFiltro; label: string }[] = [
    { key: 'TODAS', label: 'Todas' },
    { key: 'PENDIENTE', label: 'Pendientes' },
    { key: 'ACTIVO', label: 'Activas' },
    { key: 'RECHAZADO', label: 'Rechazadas' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private viviendaService: ViviendaService,
    private router: Router,
    private translate: TranslateService,
    private alquilerService: AlquilerService
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
      this.cargarSolicitudesAdmin();
    } else if (this.isPropietarioView) {
      this.cargarPerfil();
      this.cargarMisViviendas();
      this.cargarSolicitudesAlquiler();
    } else {
      this.cargarPerfil();
      this.cargarMisSolicitudes();
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

  cargarSolicitudesAlquiler(): void {
    if (!this.userId) return;

    this.solicitudesLoading = true;
    this.solicitudesError = '';

    this.alquilerService.getSolicitudesPropietario(this.userId).subscribe({
      next: (data) => {
        this.solicitudesAlquiler = data ?? [];
        this.aplicarFiltroSolicitudes();
        this.solicitudesLoading = false;
      },
      error: () => {
        this.solicitudesError = 'No se han podido cargar las solicitudes';
        this.solicitudesLoading = false;
      }
    });
  }

  seleccionarFiltroSolicitudes(filtro: SolicitudFiltro): void {
    this.filtroSolicitudes = filtro;
    this.aplicarFiltroSolicitudes();
  }

  aplicarFiltroSolicitudes(): void {
    if (this.filtroSolicitudes === 'TODAS') {
      this.solicitudesFiltradas = [...this.solicitudesAlquiler];
      return;
    }

    this.solicitudesFiltradas = this.solicitudesAlquiler.filter(
      solicitud => solicitud.estado === this.filtroSolicitudes
    );
  }

  contarSolicitudes(filtro: SolicitudFiltro): number {
    if (filtro === 'TODAS') {
      return this.solicitudesAlquiler.length;
    }

    return this.solicitudesAlquiler.filter(s => s.estado === filtro).length;
  }

  getSolicitudEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge-pending';
      case 'ACTIVO':
        return 'badge-accepted';
      case 'RECHAZADO':
        return 'badge-rejected';
      case 'CANCELADO':
        return 'badge-cancelled';
      case 'FINALIZADO':
        return 'badge-default';
      default:
        return 'badge-default';
    }
  }

  getSolicitudEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'ACTIVO':
        return 'Activa';
      case 'RECHAZADO':
        return 'Rechazada';
      case 'CANCELADO':
        return 'Cancelada';
      case 'FINALIZADO':
        return 'Finalizada';
      default:
        return estado;
    }
  }

  aceptarSolicitud(id: number): void {
    this.alquilerService.actualizarEstadoSolicitud(id, 'ACTIVO').subscribe({
      next: () => {
        this.cargarSolicitudesAlquiler();
      },
      error: () => {
        this.solicitudesError = 'No se pudo aceptar la solicitud';
      }
    });
  }

  rechazarSolicitud(id: number): void {
    this.alquilerService.actualizarEstadoSolicitud(id, 'RECHAZADO').subscribe({
      next: () => {
        this.cargarSolicitudesAlquiler();
      },
      error: () => {
        this.solicitudesError = 'No se pudo rechazar la solicitud';
      }
    });
  }

  trackSolicitud(index: number, item: AlquilerOwnerItem): number {
    return item.id;
  }

  cargarSolicitudesAdmin(): void {
    this.solicitudesAdminLoading = true;
    this.solicitudesAdminError = '';

    this.alquilerService.getTodasSolicitudes().subscribe({
      next: (data) => {
        this.solicitudesAdmin = data ?? [];
        this.aplicarFiltroSolicitudes();
        this.solicitudesAdminLoading = false;
      },
      error: () => {
        this.solicitudesAdminError = 'No se han podido cargar las solicitudes';
        this.solicitudesAdminLoading = false;
      }
    });
  }

  getSolicitudEstadoKey(estado: string): string {
    return `admin.requests.status.${estado}`;
  }

  cargarMisSolicitudes(): void {
    if (!this.userId) return;

    this.misSolicitudesLoading = true;
    this.misSolicitudesError = '';

    this.alquilerService.getSolicitudesUsuario(this.userId).subscribe({
      next: (data) => {
        this.misSolicitudes = data ?? [];
        this.misSolicitudesLoading = false;
      },
      error: () => {
        this.misSolicitudesError = 'No se han podido cargar tus solicitudes';
        this.misSolicitudesLoading = false;
      }
    });
  }

  cancelarSolicitud(id: number): void {
    const confirmCancel = confirm('¿Seguro que quieres cancelar esta solicitud?');
    if (!confirmCancel) return;

    this.alquilerService.cancelarSolicitud(id).subscribe({
      next: () => {
        this.cargarMisSolicitudes();
      },
      error: () => {
        this.misSolicitudesError = 'No se pudo cancelar la solicitud';
      }
    });
  }

  puedeCancelarSolicitud(estado: string): boolean {
    return estado !== 'CANCELADO' && estado !== 'FINALIZADO' && estado !== 'RECHAZADO';
  }
}