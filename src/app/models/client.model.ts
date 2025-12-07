export interface Policy {
  id: string;
  policyNumber: string;
  type: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: string;
}

export interface Offer {
  id: string;
  offerNumber: string;
  type: string;
  createdDate: string;
  validUntil: string;
  premium: number;
  status: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  policies: Policy[];
  offers: Offer[];
}
