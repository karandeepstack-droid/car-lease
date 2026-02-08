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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [true] // ✅ REQUIRED (template uses it)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Invalid credentials');
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.auth.handleAuthSuccess(res.token, res.user);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading = false;
        this.notify.error(err?.error?.message || 'Login failed');
      }
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
