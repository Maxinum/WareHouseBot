import { Purchase } from './purchase.model';

export const purchaseProviders = [
  {
    provide: 'PURCHASE_REPOSITORY',
    useValue: Purchase,
  },
];
