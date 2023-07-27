import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseModule } from './purchase/purchase.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [ProductModule, PurchaseModule, OrderModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
