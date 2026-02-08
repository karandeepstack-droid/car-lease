import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CarService, Car } from '../../services/car';
import { Cart } from '../../services/cart';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements AfterViewInit, OnDestroy {

  // -----------------------------
  // Data
  // -----------------------------
  cars$!: Observable<Car[]>;
  displayedCars$!: Observable<Car[]>;
  displayedCarsArr: Car[] = [];

  heroQuery = '';
  heroStart = '';
  heroEnd = '';
  today = new Date().toISOString().split('T')[0];

  activeFilterLabel = '';
  cartCount = 0;

  private heroFilter$ = new BehaviorSubject<string>('');
  private sub = new Subscription();

  // -----------------------------
  // Carousel
  // -----------------------------
  viewMode: 'grid' | 'carousel' = 'grid';
  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;
  canScrollLeft = false;
  canScrollRight = false;
  pages = 1;
  currentPage = 0;

  private readonly cardsPerPage = 4;
  private checkScrollBound = this.checkScroll.bind(this);
  private carouselAutoplayId: any = null;
  private readonly carouselAutoplayMs = 3500;

  // -----------------------------
  // Header slideshow
  // -----------------------------
  headerImages: string[] = [
    '/assets/cars/car1.jpg',
    '/assets/cars/car2.jpg',
    '/assets/cars/car3.jpg',
    '/assets/cars/car4.jpg'
  ];
  currentHeaderIndex = 0;
  private headerIntervalId: any = null;
  private readonly headerIntervalMs = 3000;

  constructor(
    private carService: CarService,
    private cart: Cart,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {
    // ✅ Normalize images for all cars
    this.cars$ = this.carService.getCars().pipe(
      map(cars => cars.map(car => ({
        ...car,
        images: car.images && car.images.length ? car.images : [car.image]
      })))
    );

    // Cart count (Zoomcar style: 0 or 1)
    this.sub.add(
      this.cart.getItems$().subscribe(items => {
        this.cartCount = items.length;
      })
    );

    // URL search (?q=)
    const urlFilter$ = this.route.queryParamMap.pipe(
      map(p => (p.get('q') || '').toLowerCase().trim())
    );

    // Combine filters
    this.displayedCars$ = combineLatest([
      this.cars$,
      urlFilter$,
      this.heroFilter$
    ]).pipe(
      map(([cars, urlQ, heroQ]) => {
        const q = (heroQ || urlQ || '').toLowerCase().trim();
        this.activeFilterLabel = q;

        if (!q) return cars;

        return cars.filter(car => {
          const name = car.name.toLowerCase();
          const makeModel = `${car.make} ${car.model}`.toLowerCase();
          return name.includes(q) || makeModel.includes(q);
        });
      })
    );

    this.sub.add(
      this.displayedCars$.subscribe(arr => {
        this.displayedCarsArr = arr || [];
        this.pages = Math.max(
          1,
          Math.ceil(this.displayedCarsArr.length / this.cardsPerPage)
        );
        if (this.currentPage >= this.pages) {
          this.currentPage = this.pages - 1;
        }
        setTimeout(() => this.checkScroll(), 80);
      })
    );
  }

  // -----------------------------
  // Search
  // -----------------------------
  onHeroInput() {
    this.heroFilter$.next(this.heroQuery || '');
  }

  applyHeroSearch() {
    const q = this.heroQuery.trim();
    this.router.navigate(['/'], { queryParams: q ? { q } : {} });
    this.heroFilter$.next(q.toLowerCase());
  }

  quickSearch(q: string) {
    this.heroQuery = q;
    this.heroFilter$.next(q.toLowerCase());
    this.router.navigate(['/'], { queryParams: { q } });
  }

  // -----------------------------
  // Zoomcar-style single car select
  // -----------------------------
  addToCart(car: Car) {
    const existing = this.cart.getItems();

    // Same car clicked → do nothing
    if (existing.length === 1 && existing[0].id === car._id) {
      this.router.navigate(['/cart']);
      return;
    }

    // Different car → replace
    if (existing.length > 0) {
      this.cart.clear();
      this.notify.info('Previous car removed');
    }

    this.cart.addItem({
      id: car._id,
      name: car.name,
      price: car.pricePerDay
    });

    this.notify.success(`${car.name} selected`);
    this.router.navigate(['/cart']);
  }

  // -----------------------------
  // Carousel lifecycle
  // -----------------------------
  ngAfterViewInit(): void {
    setTimeout(() => this.checkScroll(), 80);

    if (this.carousel?.nativeElement) {
      this.carousel.nativeElement.addEventListener(
        'scroll',
        this.checkScrollBound,
        { passive: true }
      );
    }

    this.startAutoplay();
    this.startHeaderSlideshow();
  }

  private checkScroll() {
    const el = this.carousel?.nativeElement;
    if (!el) return;

    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight =
      el.scrollWidth - el.clientWidth - el.scrollLeft > 5;

    const pageWidth = el.clientWidth || 1;
    this.currentPage = Math.round(el.scrollLeft / pageWidth);
  }

  scrollNext() {
    const el = this.carousel?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: Math.round(el.clientWidth * 0.9), behavior: 'smooth' });
  }

  scrollPrev() {
    const el = this.carousel?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: -Math.round(el.clientWidth * 0.9), behavior: 'smooth' });
  }

  pagesArray() {
    return new Array(this.pages);
  }

  goToPage(i: number) {
    const el = this.carousel?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    this.currentPage = i;
  }

  // Hooks used in template
  startAutoplay() {
    this.startCarouselAutoplay();
  }

  stopAutoplay() {
    this.stopCarouselAutoplay();
  }

  startCarouselAutoplay() {
    this.stopCarouselAutoplay();
    this.carouselAutoplayId = setInterval(() => {
      const el = this.carousel?.nativeElement;
      if (!el) return;

      this.canScrollRight
        ? this.scrollNext()
        : el.scrollTo({ left: 0, behavior: 'smooth' });
    }, this.carouselAutoplayMs);
  }

  stopCarouselAutoplay() {
    if (this.carouselAutoplayId) {
      clearInterval(this.carouselAutoplayId);
      this.carouselAutoplayId = null;
    }
  }

  startHeaderSlideshow() {
    this.stopHeaderSlideshow();
    this.headerIntervalId = setInterval(() => {
      this.currentHeaderIndex =
        (this.currentHeaderIndex + 1) % this.headerImages.length;
    }, this.headerIntervalMs);
  }

  stopHeaderSlideshow() {
    if (this.headerIntervalId) {
      clearInterval(this.headerIntervalId);
      this.headerIntervalId = null;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.stopCarouselAutoplay();
    this.stopHeaderSlideshow();

    if (this.carousel?.nativeElement) {
      try {
        this.carousel.nativeElement.removeEventListener(
          'scroll',
          this.checkScrollBound
        );
      } catch {}
    }
  }
}
