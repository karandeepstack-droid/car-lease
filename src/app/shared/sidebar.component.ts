// src/app/shared/sidebar.component.ts
import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {
  open = false;
  private sub = new Subscription();

  constructor(public sidebar: SidebarService) {
    // subscribe to service state
    this.sub.add(this.sidebar.open$.subscribe(v => this.open = v));
  }

  close() { this.sidebar.close(); }

  // close with ESC (no event argument)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.close();
  }

  // example click handlers (you can wire routerLinks or methods)
  onLogin() {
    this.close();
    // navigate or open modal via Router if needed
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
