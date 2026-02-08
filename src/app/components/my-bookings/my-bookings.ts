// src/app/components/my-bookings/my-bookings.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.scss']
})
export class MyBookings implements OnInit {

  bookings: any[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    const token = this.auth.getToken();
    if (!token) return;

    fetch("http://localhost:8000/api/bookings/my", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        this.loading = false;

        if (!res.success) {
          this.notify.error("Unable to load bookings");
          return;
        }

        this.bookings = res.bookings || [];
      })
      .catch(() => {
        this.loading = false;
        this.notify.error("Something went wrong");
      });
  }
}
