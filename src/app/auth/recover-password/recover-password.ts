import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword')?.value;
    const repeatNewPassword = control.get('repeatNewPassword')?.value;

    if (!newPassword || !repeatNewPassword) {
      return null;
    }

    return newPassword === repeatNewPassword ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, TranslatePipe],
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.css']
})
export class RecoverPasswordComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  showOldPassword = false;
  showNewPassword = false;
  showRepeatNewPassword = false;

  form = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      oldPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      repeatNewPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: passwordsMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleRepeatNewPassword(): void {
    this.showRepeatNewPassword = !this.showRepeatNewPassword;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.changePassword({
      email: this.form.controls.email.value,
      oldPassword: this.form.controls.oldPassword.value,
      newPassword: this.form.controls.newPassword.value
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = typeof response === 'string' && response.trim()
          ? response
          : this.translate.instant('auth.recoverPassword.messages.success');

        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { email: this.form.controls.email.value }
          });
        }, 1200);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = this.translate.instant('auth.recoverPassword.messages.genericError');
      }
    });
  }

  get passwordsMismatch(): boolean {
    return !!this.form.errors?.['passwordsMismatch']
      && this.form.controls.repeatNewPassword.touched;
  }
}