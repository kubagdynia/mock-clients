import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientStore } from '../../services/client-store';

@Component({
  selector: 'app-my-policies',
  imports: [CommonModule],
  templateUrl: './my-policies.html',
  styleUrl: './my-policies.css',
})
export class MyPolicies {
  private clientStore = inject(ClientStore);
  private router = inject(Router);

  selectedClient = this.clientStore.selectedClient;

  goToChooseClient(): void {
    this.router.navigate(['/choose-client']);
  }
}
