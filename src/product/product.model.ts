import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Orders } from '../order/order.model';
import { Purchase } from '../purchase/purchase.model';

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
  price: number;

  @Column({
    type: DataType.STRING,
  })
  supplier: string;

  @HasMany(() => Orders)
  orders: Orders[];

  @HasMany(() => Purchase)
  purchases: Purchase[];
}
