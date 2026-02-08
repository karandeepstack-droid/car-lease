// src/app/services/booking.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  _id?: string;
  userId?: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private API = 'http://localhost:8000/api/bookings';

  constructor(private http: HttpClient) {}

  // Create new booking
  createBooking(data: Booking): Observable<any> {
    return this.http.post<any>(this.API, data);
  }

  // Get bookings of logged-in user
  getMyBookings(): Observable<any> {
    return this.http.get<any>(`${this.API}/my`);
  }
}
