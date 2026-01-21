import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../database/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}