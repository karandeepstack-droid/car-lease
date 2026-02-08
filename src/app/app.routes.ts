import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { CarResolver } from './services/car.resolver';

export const routes: Routes = [
  // Home page
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },

  // Cart page
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then(m => m.Cart)
  },

  // Car detail page
  {
    path: 'car/:id',
    loadComponent: () => import('./components/hero/hero').then(m => m.HeroDetail),
    resolve: { car: CarResolver }  // ✅ Add resolver here
  },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.Register)
  },

  // My bookings
  {
    path: 'my-bookings',
    loadComponent: () => import('./components/my-bookings/my-bookings').then(m => m.MyBookings),
    canActivate: [authGuard]
  },

  // Fallback route
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
