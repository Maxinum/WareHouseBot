import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { Product } from 'src/product/product.model';
import { Orders } from 'src/order/order.model';
import { Purchase } from 'src/purchase/purchase.model';
config();

console.log(`username: ${process.env.DB_USER}`);
console.log(`password: ${process.env.DB_PASSWORD}`);
console.log(`database: ${process.env.DB_NAME}`);

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      sequelize.addModels([Product, Orders, Purchase]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
