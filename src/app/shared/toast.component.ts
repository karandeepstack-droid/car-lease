// src/app/shared/toast.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Toast } from './notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" *ngIf="toasts$ | async as toasts">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="t.type" role="status" aria-live="polite">
        <div class="toast-body">
          <div class="msg">{{ t.message }}</div>
          <div class="controls">
            <button class="close" (click)="dismiss(t.id)" aria-label="Close">✕</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 9999;
      max-width: calc(100% - 2rem);
      width: 360px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(2,6,23,0.12);
      padding: 0.6rem 0.8rem;
      border-left: 4px solid transparent;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
      overflow: hidden;
      animation: slideIn .18s ease;
    }
    .toast.success { border-left-color: #16a34a; }
    .toast.error   { border-left-color: #dc2626; }
    .toast.info    { border-left-color: #0ea5e9; }
    .toast-body { display:flex; align-items:center; gap: 0.5rem; }
    .msg { flex: 1; font-size: 0.95rem; color: #111827; }
    .controls { flex: 0 0 auto; }
    .close {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      color: #6b7280;
      padding: 4px;
      line-height: 1;
      border-radius: 6px;
    }
    .close:hover { color: #111827; background: rgba(0,0,0,0.03); }
    @keyframes slideIn {
      from { transform: translateY(-6px); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    @media (max-width: 420px) {
      .toast-wrapper { left: 0.5rem; right: 0.5rem; width: auto; }
    }
  `]
})
export class ToastComponent {
  toasts$!: Observable<Toast[]>;

  constructor(private notify: NotificationService) {
    this.toasts$ = this.notify.toasts.pipe(map(x => x));
  }

  dismiss(id: string) {
    this.notify.dismiss(id);
  }
}
