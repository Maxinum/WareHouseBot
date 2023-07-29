import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Orders } from './order.model';
import { Purchase } from './purchase.model';

@Table
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL,
  })
  order: number;
  @Column({
    type: DataType.DECIMAL,
  })
  purchase: number;

  @Column({
    type: DataType.STRING,
  })
  supplier: string;

  @HasMany(() => Orders)
  orders: Orders[];

  @HasMany(() => Purchase)
  purchases: Purchase[];
}
