import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from './product.model';

@Table
export class Orders extends Model {
  @Column({
    type: DataType.INTEGER,
  })
  qty: number;

  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @Column({
    type: DataType.DECIMAL,
  })
  price: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}