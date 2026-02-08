// src/app/components/signup/signup.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  loading = false;

  // Form model
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  remember = true;

  readonly API = 'http://localhost:8000/api/auth/register';

  constructor(
    private http: HttpClient,
    private notify: NotificationService,
    private router: Router
  ) {}

  submit(form: NgForm) {
    if (form.invalid) {
      this.notify.error('Please fill all required fields correctly.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notify.error('Passwords do not match.');
      return;
    }

    this.loading = true;

    this.http
      .post<any>(this.API, {
        name: this.fullName,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.notify.success('Signup successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.notify.error(err?.error?.message || 'Signup failed.');
        },
      });
  }
}
