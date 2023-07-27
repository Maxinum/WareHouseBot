import { Injectable, Inject } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: typeof Product,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll<Product>();
  }
}
