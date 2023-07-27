import { Orders } from './order.model';

export const orderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useValue: Orders,
  },
];
