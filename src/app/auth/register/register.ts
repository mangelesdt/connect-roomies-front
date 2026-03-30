import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  selectedUserType: 'arrendador' | 'arrendatario' = 'arrendatario';
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
        lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
        phone: ['', [Validators.required, Validators.pattern(/^[+0-9\s-]{7,20}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, Validators.requiredTrue]
      },
      {
        validators: this.passwordsMatchValidator
      }
    );

    this.translate.use('es');
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { notMatching: true };
  }

  selectUserType(type: 'arrendador' | 'arrendatario'): void {
    this.selectedUserType = type;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register({
      nombre: this.registerForm.value.name,
      apellidos: this.registerForm.value.lastName,
      telefono: this.registerForm.value.phone,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      rol: this.selectedUserType === 'arrendador' ? 'PROPIETARIO' : 'USUARIO'
    }).subscribe({
      next: (res) => { console.log('OK', res); 
        this.router.navigate(['/login'], { queryParams: { email: this.registerForm.value.email }}); 
      },
      error: (err) => { console.log('ERROR', err); this.errorMessage = 'Error al registrar usuario'; }
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.registerForm.get(controlName);

    if (!control) return false;

    if (errorName) {
      return !!control.hasError(errorName) && (control.touched || this.submitted);
    }

    return !!control.invalid && (control.touched || this.submitted);
  }

  passwordsDoNotMatch(): boolean {
    return !!this.registerForm.hasError('notMatching')
      && (this.f['confirmPassword']?.touched || this.submitted);
  }
}