import { Component, inject } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientStore } from './services/client-store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'mock-clients';
  private clientStore = inject(ClientStore);
  private router = inject(Router);

  selectedClient = this.clientStore.selectedClient;
  showHeader = false;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showHeader = !event.url.includes('choose-client');
      });
  }

  goToChooseClient(): void {
    this.clientStore.clearSelectedClient();
    this.router.navigate(['/choose-client']);
  }
}
