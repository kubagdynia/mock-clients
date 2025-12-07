import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientStore } from '../../services/client-store';

@Component({
  selector: 'app-choose-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './choose-client.html',
  styleUrl: './choose-client.css',
})
export class ChooseClient {
  private clientStore = inject(ClientStore);
  private router = inject(Router);

  clients = this.clientStore.clients;
  selectedClient = this.clientStore.selectedClient;
  isLoading = this.clientStore.isLoading;
  showDevPanel = false;
  showRawJson = false;
  rawJsonData = '';
  isEditingJson = false;
  editedJsonData = '';

  // Mock configuration
  mockEnabled = this.clientStore.mockEnabled;

  // Delay configuration
  delayEnabled = this.clientStore.delayEnabled;
  delayMin = this.clientStore.delayMin;
  delayMax = this.clientStore.delayMax;
  showDelayConfig = false;
  tempDelayMin = 200;
  tempDelayMax = 800;

  isClientSelected(clientId: string): boolean {
    return this.selectedClient()?.id === clientId;
  }

  async selectClient(clientId: string): Promise<void> {
    await this.clientStore.selectClient(clientId);
    this.router.navigate(['/my-policies']);
  }

  downloadData(): void {
    this.clientStore.downloadDataAsFile();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const success = await this.clientStore.importData(content);

        if (success) {
          alert('Dane zostały pomyślnie załadowane!');
        } else {
          alert('Błąd podczas ładowania danych. Sprawdź format pliku JSON.');
        }
      };
      reader.readAsText(file);
      input.value = '';
    }
  }

  toggleDevPanel(): void {
    this.showDevPanel = !this.showDevPanel;
  }

  async clearAllData(): Promise<void> {
    if (confirm('Czy na pewno chcesz wyczyścić wszystkie dane?')) {
      await this.clientStore.clearAllData();
      alert('Dane zostały wyczyszczone!');
    }
  }

  async resetToMock(): Promise<void> {
    if (confirm('Czy na pewno chcesz przywrócić domyślne dane mockowe?')) {
      await this.clientStore.resetToMock();
      alert('Dane mockowe zostały przywrócone!');
    }
  }

  toggleRawJson(): void {
    this.showRawJson = !this.showRawJson;
    if (this.showRawJson) {
      this.rawJsonData = this.clientStore.getRawJson();
      this.isEditingJson = false;
    }
  }

  enableJsonEdit(): void {
    this.isEditingJson = true;
    this.editedJsonData = this.rawJsonData;
  }

  cancelJsonEdit(): void {
    this.isEditingJson = false;
    this.editedJsonData = '';
  }

  async saveJsonData(): Promise<void> {
    if (!this.editedJsonData.trim()) {
      alert('JSON nie może być pusty!');
      return;
    }

    const success = await this.clientStore.importData(this.editedJsonData);

    if (success) {
      this.rawJsonData = this.editedJsonData;
      this.isEditingJson = false;
      alert('Dane JSON zostały zapisane!');
    } else {
      alert('Błąd: Nieprawidłowy format JSON. Sprawdź składnię.');
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.rawJsonData).then(() => {
      alert('JSON skopiowany do schowka!');
    });
  }

  toggleDelayConfig(): void {
    this.showDelayConfig = !this.showDelayConfig;
    if (this.showDelayConfig) {
      this.tempDelayMin = this.delayMin();
      this.tempDelayMax = this.delayMax();
    }
  }

  toggleMockEnabled(): void {
    this.clientStore.setMockEnabled(!this.mockEnabled());
  }

  toggleDelayEnabled(): void {
    this.clientStore.setDelayConfig(
      !this.delayEnabled(),
      this.delayMin(),
      this.delayMax()
    );
  }

  applyDelayConfig(): void {
    if (this.tempDelayMin < 0) {
      alert('Minimalne opóźnienie nie może być ujemne!');
      return;
    }
    if (this.tempDelayMax < this.tempDelayMin) {
      alert('Maksymalne opóźnienie musi być większe lub równe minimalnemu!');
      return;
    }
    this.clientStore.setDelayConfig(
      this.delayEnabled(),
      this.tempDelayMin,
      this.tempDelayMax
    );
    alert(`Opóźnienie ustawione: ${this.tempDelayMin}-${this.tempDelayMax}ms`);
  }
}
