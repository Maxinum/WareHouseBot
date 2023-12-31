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
    allowNull: false,
  })
  qty: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

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
