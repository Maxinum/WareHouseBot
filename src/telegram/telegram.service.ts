import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { Orders } from '../models/order.model';
import { Purchase } from '../models/purchase.model';
import { Product } from '../models/product.model';
import sequelize from 'sequelize';

interface ProductStatisticResult {
  'Product.name': string;
  totalQuantity: number;
}

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    this.setupCommands();
    this.setupActions();
  }

  private setupCommands(): void {
    this.bot.command('start', (ctx) => {
      ctx.reply('WareHouseBot ', this.getReplyOptions());
    });
  }

  private setupActions(): void {
    this.bot.hears('All Orders', async (ctx) => {
      const userId = ctx.message?.from?.id;
      const message = await this.getAllItems(userId, Orders, 'Order');
      ctx.reply(message, this.getReplyOptions());
    });

    this.bot.hears('All Purchases', async (ctx) => {
      const userId = ctx.message?.from?.id;
      const message = await this.getAllItems(userId, Purchase, 'Purchase');
      ctx.reply(message, this.getReplyOptions());
    });

    this.bot.hears('statistic per products', async (ctx) => {
      const userId = ctx.message?.from?.id;
      const statistics = await Orders.findAll({
        attributes: [
          [sequelize.literal('product.name'), 'productName'], // Use a different alias for 'product.name'
          [sequelize.fn('SUM', sequelize.col('qty')), 'totalQuantity'],
        ],
        include: {
          model: Product,
          attributes: [],
        },
        where: { userId },
        group: ['productId', 'product.name'],
      });

      const message = this.createMessage(statistics);

      ctx.reply(message, this.getReplyOptions());
    });

    this.bot.hears('Quantity in stock', async (ctx) => {
      try {
        const userId = ctx.message?.from?.id;

        const purchaseQuantities = await Purchase.findAll({
          attributes: [
            [sequelize.literal('product.name'), 'productName'],
            [
              sequelize.fn('SUM', sequelize.col('qty')),
              'totalPurchaseQuantity',
            ],
          ],
          include: {
            model: Product,
            attributes: [],
          },
          where: { userId },
          group: ['productName'],
        });

        const orderQuantities = await Orders.findAll({
          attributes: [
            [sequelize.literal('product.name'), 'productName'],
            [sequelize.fn('SUM', sequelize.col('qty')), 'totalOrderQuantity'],
          ],
          include: {
            model: Product,
            attributes: [],
          },
          where: { userId },
          group: ['productName'],
        });

        const productQuantityMap = new Map<
          string,
          { totalPurchaseQuantity: number; totalOrderQuantity: number }
        >();

        purchaseQuantities.forEach((purchase) => {
          productQuantityMap.set(purchase.getDataValue('productName'), {
            totalPurchaseQuantity:
              purchase.getDataValue('totalPurchaseQuantity') || 0,
            totalOrderQuantity: 0,
          });
        });

        orderQuantities.forEach((order) => {
          const productName = order.getDataValue('productName');
          if (productQuantityMap.has(productName)) {
            const existingQuantity = productQuantityMap.get(productName);
            productQuantityMap.set(productName, {
              ...existingQuantity,
              totalOrderQuantity: order.getDataValue('totalOrderQuantity') || 0,
            });
          } else {
            productQuantityMap.set(productName, {
              totalPurchaseQuantity: 0,
              totalOrderQuantity: order.getDataValue('totalOrderQuantity') || 0,
            });
          }
        });

        let message = 'Quantity in stock:\n';
        productQuantityMap.forEach((quantityData, productName) => {
          const total =
            quantityData.totalPurchaseQuantity -
            quantityData.totalOrderQuantity;
          message += `
          Product: ${productName}
          Quantity: ${total}
          `;
        });

        ctx.reply(message, this.getReplyOptions());
      } catch (error) {
        console.error('Error:', error);
        ctx.reply('An error occurred while fetching the quantity in stock.');
      }
    });
  }

  private getReplyOptions(): any {
    const keyboard = {
      reply_markup: {
        keyboard: [
          ['All Orders', 'All Purchases'],
          ['statistic per products'],
          ['Quantity in stock'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };

    return keyboard;
  }

  public startPolling(): void {
    this.bot.launch();
  }

  private async getAllItems(
    userId: number,
    Model,
    modelName: string,
  ): Promise<string> {
    const items = await Model.findAll({
      where: { userId },
      include: Product,
    });

    let message = `All your ${modelName}s:\n`;
    items.forEach((item, index) => {
      message += `
  ${modelName} №${index + 1}
  Supplier: ${item.product.supplier}
  Product: ${item.product.name}
  Qty: ${item.qty}
  Price: €${item.price}
  `;
    });

    return message;
  }

  private createMessage(data) {
    let statisticsMessage = 'Product Statistics:\n';
    data.forEach((item, index) => {
      statisticsMessage += `
      Product №${index + 1}
      Name: ${item.getDataValue('productName')} 
      Total Quantity: ${item.getDataValue('totalQuantity')} 
      `;
    });

    return statisticsMessage;
  }
}
