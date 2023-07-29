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
      const orders = await Orders.findAll({ where: { userId } });
      ctx.reply('Orders: ' + JSON.stringify(orders), this.getReplyOptions());
    });

    this.bot.hears('All Purchases', async (ctx) => {
      const userId = ctx.message?.from?.id;
      const purchases = await Purchase.findAll({ where: { userId } });
      ctx.reply(
        'Purchases: ' + JSON.stringify(purchases),
        this.getReplyOptions(),
      );
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
