import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Cart } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {
  items: any[] = [];
  startDate = '';
  endDate = '';
  loading = false;

  readonly API = 'http://localhost:8000/api/bookings';

  constructor(
    private cart: Cart,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.items = this.cart.getItems();

    // Enforce Zoomcar rule: only one car at a time
    if (this.items.length > 1) {
      this.notify.error('Only one car can be booked at a time');
      this.router.navigate(['/cart']);
    }
  }

  private calculateDays(): number {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  submit(): void {
    if (!this.startDate || !this.endDate) {
      this.notify.error('Please select start and end dates');
      return;
    }

    const days = this.calculateDays();
    if (days <= 0) {
      this.notify.error('End date must be after start date');
      return;
    }

    if (this.items.length === 0) {
      this.notify.error('No car selected');
      this.router.navigate(['/']);
      return;
    }

    const carId = this.items[0].id;
    this.loading = true;

    this.http.post<any>(this.API, {
      carId,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.cart.clear();

        this.router.navigate(['/success'], {
          state: { booking: res.booking }
        });
      },
      error: (err) => {
        this.loading = false;
        this.notify.error(err?.error?.message || 'Booking failed');
      }
    });
  }
}
