import { Injectable, Inject } from '@nestjs/common';
import { Orders } from './order.model';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: typeof Orders,
  ) {}

  async findAll(): Promise<Orders[]> {
    return this.orderRepository.findAll<Orders>();
  }
}
