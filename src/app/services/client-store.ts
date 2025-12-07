import { Injectable, signal } from '@angular/core';
import { Client, Policy, Offer } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientStore {
  private readonly STORAGE_KEY = 'mock-clients-data';
  private readonly SELECTED_CLIENT_KEY = 'mock-clients-selected';

  clients = signal<Client[]>([]);
  selectedClient = signal<Client | null>(null);
  isLoading = signal<boolean>(false);

  // Konfiguracja trybu pracy
  mockEnabled = signal<boolean>(true);

  // Konfiguracja opóźnień
  delayEnabled = signal<boolean>(false);
  delayMin = signal<number>(200);
  delayMax = signal<number>(800);

  private delay(ms?: number): Promise<void> {
    if (!this.delayEnabled()) {
      return Promise.resolve();
    }
    const min = this.delayMin();
    const max = this.delayMax();
    const delayMs = ms ?? Math.floor(Math.random() * (max - min)) + min;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  setDelayConfig(enabled: boolean, min: number, max: number): void {
    this.delayEnabled.set(enabled);
    this.delayMin.set(Math.max(0, min));
    this.delayMax.set(Math.max(min, max));
  }

  setMockEnabled(enabled: boolean): void {
    this.mockEnabled.set(enabled);
    if (!enabled) {
      console.warn(
        '🚨 Tryb MOCK wyłączony - aplikacja będzie próbowała łączyć się z backendem'
      );
    } else {
      console.info('✅ Tryb MOCK włączony - używane są dane lokalne');
    }
  }

  async initialize(): Promise<void> {
    this.isLoading.set(true);
    await this.delay();
    this.loadData();
    this.loadSelectedClient();
    this.isLoading.set(false);
  }

  private getMockData(): Client[] {
    return [
      {
        id: '1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        description: 'Długoletni klient z wieloma polisami ubezpieczeniowymi',
        policies: [
          {
            id: 'p1',
            policyNumber: 'POL/2023/001',
            type: 'Ubezpieczenie OC/AC',
            startDate: '2023-01-15',
            endDate: '2024-01-15',
            premium: 1200,
            status: 'Aktywna',
          },
          {
            id: 'p2',
            policyNumber: 'POL/2023/045',
            type: 'Ubezpieczenie mieszkania',
            startDate: '2023-06-01',
            endDate: '2024-06-01',
            premium: 450,
            status: 'Aktywna',
          },
        ],
        offers: [
          {
            id: 'o1',
            offerNumber: 'OFF/2024/120',
            type: 'Ubezpieczenie na życie',
            createdDate: '2024-11-01',
            validUntil: '2024-12-31',
            premium: 850,
            status: 'Oczekująca',
          },
        ],
      },
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Nowak',
        description: 'Klient biznesowy z ubezpieczeniami firmowymi',
        policies: [
          {
            id: 'p3',
            policyNumber: 'POL/2023/089',
            type: 'Ubezpieczenie firmy',
            startDate: '2023-03-10',
            endDate: '2024-03-10',
            premium: 3500,
            status: 'Aktywna',
          },
        ],
        offers: [
          {
            id: 'o2',
            offerNumber: 'OFF/2024/145',
            type: 'Ubezpieczenie floty pojazdów',
            createdDate: '2024-11-15',
            validUntil: '2025-01-15',
            premium: 5200,
            status: 'Oczekująca',
          },
          {
            id: 'o3',
            offerNumber: 'OFF/2024/156',
            type: 'Ubezpieczenie cyber',
            createdDate: '2024-11-20',
            validUntil: '2025-01-20',
            premium: 2100,
            status: 'W trakcie analizy',
          },
        ],
      },
      {
        id: '3',
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        description: 'Młody klient z podstawowymi ubezpieczeniami',
        policies: [
          {
            id: 'p4',
            policyNumber: 'POL/2024/012',
            type: 'Ubezpieczenie OC',
            startDate: '2024-02-01',
            endDate: '2025-02-01',
            premium: 800,
            status: 'Aktywna',
          },
        ],
        offers: [],
      },
      {
        id: '4',
        firstName: 'Maria',
        lastName: 'Kamińska',
        description: 'Klient z ubezpieczeniami zdrowotnymi i majątkowymi',
        policies: [
          {
            id: 'p5',
            policyNumber: 'POL/2023/134',
            type: 'Ubezpieczenie zdrowotne',
            startDate: '2023-09-01',
            endDate: '2024-09-01',
            premium: 1500,
            status: 'Aktywna',
          },
          {
            id: 'p6',
            policyNumber: 'POL/2023/135',
            type: 'Ubezpieczenie domu',
            startDate: '2023-09-15',
            endDate: '2024-09-15',
            premium: 680,
            status: 'Aktywna',
          },
        ],
        offers: [
          {
            id: 'o4',
            offerNumber: 'OFF/2024/178',
            type: 'Ubezpieczenie turystyczne',
            createdDate: '2024-12-01',
            validUntil: '2024-12-20',
            premium: 150,
            status: 'Oczekująca',
          },
        ],
      },
      {
        id: '5',
        firstName: 'Tomasz',
        lastName: 'Lewandowski',
        description: 'Nowy klient zainteresowany ubezpieczeniami rodzinnymi',
        policies: [],
        offers: [
          {
            id: 'o5',
            offerNumber: 'OFF/2024/190',
            type: 'Ubezpieczenie rodzinne',
            createdDate: '2024-11-28',
            validUntil: '2025-01-28',
            premium: 1100,
            status: 'Nowa oferta',
          },
          {
            id: 'o6',
            offerNumber: 'OFF/2024/191',
            type: 'Ubezpieczenie OC/AC',
            createdDate: '2024-11-28',
            validUntil: '2025-01-28',
            premium: 950,
            status: 'Nowa oferta',
          },
        ],
      },
    ];
  }

  private loadData(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.clients.set(parsedData);
      } catch (error) {
        console.error('Błąd podczas parsowania danych z localStorage', error);
        this.loadMockData();
      }
    } else {
      this.loadMockData();
    }
  }

  private loadSelectedClient(): void {
    const selectedClientId = sessionStorage.getItem(this.SELECTED_CLIENT_KEY);
    console.log('🔍 loadSelectedClient - ID from sessionStorage:', selectedClientId);
    console.log('🔍 Available clients:', this.clients().map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` })));
    
    if (selectedClientId) {
      const client = this.clients().find((c) => c.id === selectedClientId);
      console.log('🔍 Found client:', client);
      
      if (client) {
        this.selectedClient.set(client);
        console.log('✅ Selected client set:', client.firstName, client.lastName);
      } else {
        console.warn('⚠️ Client not found, removing from sessionStorage');
        // Jeśli klient nie istnieje, usuń z sessionStorage
        sessionStorage.removeItem(this.SELECTED_CLIENT_KEY);
      }
    } else {
      console.log('ℹ️ No selected client in sessionStorage');
    }
  }

  private loadMockData(): void {
    const mockData = this.getMockData();
    this.clients.set(mockData);
    this.saveData();
  }

  private saveData(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clients()));
  }

  async selectClient(clientId: string): Promise<void> {
    this.isLoading.set(true);
    await this.delay();
    const client = this.clients().find((c) => c.id === clientId);
    if (client) {
      this.selectedClient.set(client);
      sessionStorage.setItem(this.SELECTED_CLIENT_KEY, client.id);
    }
    this.isLoading.set(false);
  }

  clearSelectedClient(): void {
    this.selectedClient.set(null);
    sessionStorage.removeItem(this.SELECTED_CLIENT_KEY);
  }

  exportData(): string {
    return JSON.stringify(this.clients(), null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    this.isLoading.set(true);
    await this.delay();
    try {
      const parsedData = JSON.parse(jsonData);
      if (Array.isArray(parsedData)) {
        this.clients.set(parsedData);
        this.saveData();
        this.isLoading.set(false);
        return true;
      }
      this.isLoading.set(false);
      return false;
    } catch (error) {
      console.error('Błąd podczas importu danych', error);
      this.isLoading.set(false);
      return false;
    }
  }

  downloadDataAsFile(): void {
    const dataStr = this.exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mock-clients-${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async clearAllData(): Promise<void> {
    this.isLoading.set(true);
    await this.delay();
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.SELECTED_CLIENT_KEY);
    this.clients.set([]);
    this.selectedClient.set(null);
    this.isLoading.set(false);
  }

  async resetToMock(): Promise<void> {
    this.isLoading.set(true);
    await this.delay();
    this.loadMockData();
    this.isLoading.set(false);
  }

  getRawJson(): string {
    return this.exportData();
  }
}
