import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Home } from './home';
import { CarService } from '../../services/car';
import { Cart } from '../../services/cart';
import { NotificationService } from '../../shared/notification.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CarService, useValue: { getCars: () => of([]) } },
        { provide: Cart, useValue: { getItems$: () => of([]), addItem: () => {} } },
        { provide: NotificationService, useValue: { success: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
