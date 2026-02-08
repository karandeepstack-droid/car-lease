import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Car {
  _id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  seats: number;
  transmission: string;
  fuel: string;
  pricePerDay: number;
  image: string;
  images?: string[]; // ✅ FIX for hero gallery
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private API = 'http://localhost:8000/api/cars';
  private cars$?: Observable<Car[]>;

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    if (!this.cars$) {
      this.cars$ = this.http
        .get<{ success: boolean; cars: Car[] }>(this.API)
        .pipe(
          map(res => res.cars),
          shareReplay(1)
        );
    }
    return this.cars$;
  }

  getCarById(id: string): Observable<Car> {
    return this.http
      .get<{ success: boolean; car: Car }>(`${this.API}/${id}`)
      .pipe(map(res => res.car));
      
  }
}
