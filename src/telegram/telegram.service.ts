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
          [sequelize.literal('`product.name`'), 'product'],
          [sequelize.fn('SUM', sequelize.col('qty')), 'totalQuantity'],
        ],
        include: {
          model: Product,
          attributes: [],
        },
        where: { userId },
        group: ['productId', 'product.name'],
      });

      console.log(statistics);

      let statisticsMessage = 'Product Statistics:\n';
      statistics.forEach((stat, index) => {
        statisticsMessage += `
    Product №${index + 1}
    Name: ${stat.getDataValue('product')}
    Total Quantity: ${stat.getDataValue('totalQuantity')}
    `;
      });

      ctx.reply(statisticsMessage, this.getReplyOptions());
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
}
