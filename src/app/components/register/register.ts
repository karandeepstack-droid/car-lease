import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      remember: [true]
    });
  }

  passwordsMatch(): boolean {
    return this.password?.value === this.confirmPassword?.value;
  }

  submit(): void {
    if (this.form.invalid || !this.passwordsMatch()) {
      this.form.markAllAsTouched();
      this.notify.error('Fix form errors');
      return;
    }

    this.loading = true;

    this.auth.register({
      name: this.name?.value,
      email: this.email?.value,
      password: this.password?.value
    }).subscribe({
      next: (_res: any) => {
        this.loading = false;
        this.notify.success('Account created');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.notify.error(err?.error?.message || 'Registration failed');
      }
    });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}
