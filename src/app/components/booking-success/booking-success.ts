// src/app/components/booking-success/booking-success.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.scss']
})
export class BookingSuccess implements OnInit {

  booking!: {
    _id: string;
    car: {
      name: string;
      make: string;
      model: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    if (!state || !state.booking) {
      // refresh / direct access protection
      this.router.navigate(['/']);
      return;
    }

    this.booking = state.booking;
  }
}
