import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

@Injectable({
  providedIn: 'root'
})
export class Cart {

  private items: CartItem[] = [];
  private items$ = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  // -----------------------------
  // Storage helpers
  // -----------------------------
  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadFromStorage() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.items = JSON.parse(data) as CartItem[];
      this.items$.next(this.cloneItems());
    }
  }

  // -----------------------------
  // ✅ Zoomcar rule: ONE CAR ONLY
  // -----------------------------
  addItem(item: Omit<CartItem, 'qty'> & { qty?: number }): void {
    // Always replace existing car
    this.items = [{
      ...item,
      qty: item.qty ?? 1
    }];

    this.items$.next(this.cloneItems());
    this.saveToStorage();
  }

  removeItem(id: string): void {
    this.items = [];
    this.items$.next([]);
    this.saveToStorage();
  }

  clear(): void {
    this.items = [];
    this.items$.next([]);
    this.saveToStorage();
  }

  // -----------------------------
  // Getters
  // -----------------------------
  getItems(): CartItem[] {
    return this.cloneItems();
  }

  getItems$(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  getTotal(): number {
    return this.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  getCount(): number {
    return this.items.length; // always 0 or 1
  }

  private cloneItems(): CartItem[] {
    return this.items.map(i => ({ ...i }));
  }
}
