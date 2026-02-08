import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // milliseconds; undefined => sticky
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts = this.toasts$.asObservable();

  private makeId() {
    return Math.random().toString(36).slice(2, 9);
  }

  show(message: string, type: ToastType = 'info', duration = 4000) {
    const t: Toast = { id: this.makeId(), message, type, duration };
    const current = this.toasts$.value;
    this.toasts$.next([t, ...current]);

    if (duration && duration > 0) {
      setTimeout(() => this.dismiss(t.id), duration);
    }

    return t.id;
  }

  success(message: string, duration = 3500) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  dismiss(id: string) {
    const filtered = this.toasts$.value.filter(t => t.id !== id);
    this.toasts$.next(filtered);
  }

  clear() {
    this.toasts$.next([]);
  }
}
