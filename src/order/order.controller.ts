import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Orders } from './order.model';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get()
  async getAllOrders(): Promise<Orders[]> {
    return this.service.findAll();
  }
}
