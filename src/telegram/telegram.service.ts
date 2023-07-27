import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
// import { AppService } from 'src/app.service';

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
      ctx.reply('...');
    });

    this.bot.hears('All Purchases', async (ctx) => {
      ctx.reply('...');
    });

    this.bot.hears('statistic per products', async (ctx) => {
      ctx.reply('...');
    });

    this.bot.hears('statistic per suppliers', async (ctx) => {
      ctx.reply('...');
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
