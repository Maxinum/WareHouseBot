import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const port = process.env.PORT;
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    const bot = app.get(TelegramService);
    bot.startPolling();
    await app.listen(port, () =>
      console.log(`App started successfully on ${port}`),
    );
  } catch (e) {
    console.log(e);
  }
}
bootstrap();
