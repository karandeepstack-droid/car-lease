import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth';

describe('AuthService (register)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a new user', () => {
    service.register({
      name: 'Test',
      email: 'test@test.com',
      password: 'secret'
    }).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/register');
    expect(req.request.method).toBe('POST');

    req.flush({ success: true });
  });

  it('should not allow duplicate email', () => {
    service.register({
      name: 'Test',
      email: 'test@test.com',
      password: 'secret'
    }).subscribe({
      next: () => fail('Expected error'),
      error: err => {
        expect(err.status).toBe(409);
      }
    });

    const req = httpMock.expectOne('http://localhost:8000/api/auth/register');
    req.flush(
      { message: 'Email exists' },
      { status: 409, statusText: 'Conflict' }
    );
  });
});
