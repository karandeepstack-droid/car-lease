import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Cart, CartItem } from '../../services/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private sub: Subscription = new Subscription();

  constructor(private cart: Cart, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart items
    this.sub.add(
      this.cart.getItems$().subscribe(items => {
        this.items = items;
      })
    );
  }

  remove(id: string) {
    this.cart.removeItem(id);
  }

  checkout() {
    if (!this.items.length) return;
    // Navigate to checkout page (make sure route exists)
    this.router.navigate(['/checkout']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
