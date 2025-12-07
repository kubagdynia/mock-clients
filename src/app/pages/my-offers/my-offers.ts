import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientStore } from '../../services/client-store';

@Component({
  selector: 'app-my-offers',
  imports: [CommonModule],
  templateUrl: './my-offers.html',
  styleUrl: './my-offers.css',
})
export class MyOffers {
  private clientStore = inject(ClientStore);
  private router = inject(Router);

  selectedClient = this.clientStore.selectedClient;

  goToChooseClient(): void {
    this.router.navigate(['/choose-client']);
  }
}
