import { Component } from '@angular/core';
import { ToastComponent } from './shared/toast.component';
import { SidebarComponent } from './shared/sidebar.component';

import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cart } from './services/cart';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { FooterComponent } from './components/footer/footer';
import { SidebarService } from './shared/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    FormsModule,
    CommonModule,
    ToastComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  search = '';
  private searchTimer: any = null;
  private readonly SEARCH_DEBOUNCE_MS = 300;

  constructor(
    public cart: Cart,
    public auth: AuthService,
    public sidebar: SidebarService,
    private router: Router
  ) {}

  // 🔍 Search with debounce + routing
  onSearch(value?: string) {
    this.search = (value ?? this.search ?? '').trim();

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.searchTimer = setTimeout(() => {
      this.searchTimer = null;

      // ⭐ Actually navigate to Home with ?q=
      this.router.navigate(['/'], {
        queryParams: this.search ? { q: this.search } : {}
      });

    }, this.SEARCH_DEBOUNCE_MS);
  }

  // 🔐 Logout and redirect to home
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
