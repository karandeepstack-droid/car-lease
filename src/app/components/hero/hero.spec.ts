import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeroDetail } from './hero';

describe('HeroDetail', () => {
  let component: HeroDetail;
  let fixture: ComponentFixture<HeroDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetail, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
