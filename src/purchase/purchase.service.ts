import { Injectable, Inject } from '@nestjs/common';
import { Purchase } from './purchase.model';

@Injectable()
export class PurchaseService {
  constructor(
    @Inject('PURCHASE_REPOSITORY')
    private purchaseRepository: typeof Purchase,
  ) {}

  async findAll(): Promise<Purchase[]> {
    return this.purchaseRepository.findAll<Purchase>();
  }
}
