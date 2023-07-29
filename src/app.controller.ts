import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/product')
  getProduct() {
    return this.appService.getProduct();
  }

  @Post('/order')
  sendOrder(@Body() orderData: { operation: string; data: any[] }) {
    return this.appService.saveData(orderData.operation, orderData.data);
  }
}
