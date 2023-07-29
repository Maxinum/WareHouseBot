import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { Orders } from '../models/order.model';
import { Purchase } from '../models/purchase.model';
import { Product } from '../models/product.model';
import sequelize from 'sequelize';

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
      const orders = await Orders.findAll({
        where: { userId },
        include: Product,
      });

      console.log(orders);
      let orderMessage = 'All your Orders:\n';
      orders.forEach((order, index) => {
        orderMessage += `
    Order №${index + 1}
    Supplier: ${order.product.supplier}
    Product: ${order.product.name}
    Qty: ${order.qty}
    Price: ${order.price}
    `;
      });

      ctx.reply(orderMessage, this.getReplyOptions());
    });

    this.bot.hears('All Purchases', async (ctx) => {
      const userId = ctx.message?.from?.id;
      const purchases = await Purchase.findAll({
        where: { userId },
        include: Product,
      });

      let purchaseMessage = 'All your Orders:\n';
      purchases.forEach((order, index) => {
        purchaseMessage += `
    Purchase №${index + 1}
    Supplier: ${order.product.supplier}
    Product: ${order.product.name}
    Qty: ${order.qty}
    Price: ${order.price}
    `;
      });

      ctx.reply(purchaseMessage, this.getReplyOptions());
    });

    this.bot.hears('statistic per products', async (ctx) => {
      const statistics = await Orders.findAll({
        attributes: [
          'productId',
          [sequelize.fn('SUM', sequelize.col('qty')), 'totalQuantity'],
        ],
        group: ['productId'],
      });

      ctx.reply(
        'Product Statistics: ' + JSON.stringify(statistics),
        this.getReplyOptions(),
      );
    });

    this.bot.hears('statistic per suppliers', async (ctx) => {
      const statistics = await Purchase.findAll({
        attributes: [
          'supplier',
          [sequelize.fn('SUM', sequelize.col('qty')), 'totalQuantity'],
        ],
        group: ['supplier'],
      });

      ctx.reply(
        'Supplier Statistics: ' + JSON.stringify(statistics),
        this.getReplyOptions(),
      );
    });
  }

  private getReplyOptions(): any {
    const keyboard = {
      reply_markup: {
        keyboard: [
          ['All Orders', 'All Purchases'],
          ['statistic per products'],
          ['statistic per suppliers'],
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
}
