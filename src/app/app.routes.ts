import { Routes } from '@angular/router';
import { ChooseClient } from './pages/choose-client/choose-client';
import { MyPolicies } from './pages/my-policies/my-policies';
import { MyOffers } from './pages/my-offers/my-offers';

export const routes: Routes = [
  { path: '', redirectTo: '/choose-client', pathMatch: 'full' },
  { path: 'choose-client', component: ChooseClient },
  { path: 'my-policies', component: MyPolicies },
  { path: 'my-offers', component: MyOffers },
];
