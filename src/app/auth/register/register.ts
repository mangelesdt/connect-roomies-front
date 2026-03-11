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
  selectedUserType: 'student' | 'landlord' = 'student';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
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

  selectUserType(type: 'student' | 'landlord'): void {
    this.selectedUserType = type;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.registerForm.value,
      userType: this.selectedUserType
    };

    console.log('Registro válido:', payload);
    this.router.navigate(['/login']);
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