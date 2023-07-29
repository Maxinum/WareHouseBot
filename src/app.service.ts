import { Injectable } from '@nestjs/common';
import { Orders } from './models/order.model';
import { Purchase } from './models/purchase.model';
import { Product } from './models/product.model';
@Injectable()
export class AppService {
  getProduct(): Promise<Product[]> {
    return Product.findAll<Product>();
  }

  async saveData(operation: string, data: any[]) {
    console.log(operation);
    console.log(data);
    if (operation === 'Sale') {
      const orderEntries = data.map((item) => ({
        qty: item.qty,
        productId: item.product_id,
        price: item.price,
        userId: item.user_id,
      }));

      return Orders.bulkCreate(orderEntries);
    } else if (operation === 'Purchase') {
      const purchaseEntries = data.map((item) => ({
        qty: item.qty,
        productId: item.product_id,
        price: item.price,
        userId: item.user_id,
      }));

      return Purchase.bulkCreate(purchaseEntries);
    } else {
      throw new Error('Invalid operation');
    }
  }
}
