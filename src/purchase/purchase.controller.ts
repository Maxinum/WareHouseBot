import { Controller, Get } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { Purchase } from './purchase.model';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly service: PurchaseService) {}

  @Get()
  async getAllProducts(): Promise<Purchase[]> {
    return this.service.findAll();
  }
}
