import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CarService, Car } from './car';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CarResolver implements Resolve<Car | null> {
  constructor(private carService: CarService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Car | null> {
    const id = route.paramMap.get('id');
    if (!id) return of(null);

    return this.carService.getCarById(id).pipe(
      catchError(() => of(null)) // return null if API fails
    );
  }
}
