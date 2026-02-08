import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Car } from '../../services/car';
import { Cart } from '../../services/cart';
import { NotificationService } from '../../shared/notification.service';
import { Log } from '../../shared/decorators/log.decorator';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroDetail implements OnDestroy, AfterViewInit {
  car: Car | null = null;

  images: string[] = [];
  current = 0;

  autoplay = true;
  autoplayMs = 3500;
  private autoplayTimer: any = null;

  zoomOpen = false;
  zoomImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cart: Cart,
    private notify: NotificationService
  ) {
    const resolvedCar = this.route.snapshot.data['car'] as Car | null;
    if (resolvedCar) {
      this.car = resolvedCar;
      this.images = resolvedCar.images?.length
        ? resolvedCar.images
        : resolvedCar.image
        ? [resolvedCar.image]
        : [];
    }
  }

  ngAfterViewInit(): void {
    if (this.autoplay && this.images.length > 1) this.startAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => this.next(), this.autoplayMs);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  next() {
    if (!this.images.length) return;
    this.current = (this.current + 1) % this.images.length;
  }

  prev() {
    if (!this.images.length) return;
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }

  openZoom(img: string) {
    this.zoomImage = img;
    this.zoomOpen = true;
    this.stopAutoplay();
  }

  closeZoom() {
    this.zoomOpen = false;
    this.zoomImage = null;
    if (this.autoplay) this.startAutoplay();
  }

  @Log('cart')
  addToCart() {
    if (!this.car) return;

    const existing = this.cart.getItems();
    if (existing.length > 0 && existing[0].id !== this.car._id) {
      this.cart.clear();
      this.notify.info('Previous car removed');
    }

    this.cart.addItem({
      id: this.car._id,
      name: this.car.name,
      price: this.car.pricePerDay,
      qty: 1
    });

    this.notify.success(`${this.car.name} added to cart`);
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }
}
