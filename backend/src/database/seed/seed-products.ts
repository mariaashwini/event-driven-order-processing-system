import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';

export async function seedProducts(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);

  // Check if products already exist
  const count = await productRepo.count();
  if (count > 0) {
    console.log('Products already seeded. Skipping...');
    return;
  }

  const products: Partial<Product>[] = [
    {
      name: 'Laptop',
      price: 50000,
      stockQuantity: 10,
    },
    {
      name: 'Mouse',
      price: 1000,
      stockQuantity: 50,
    },
    {
      name: 'Keyboard',
      price: 2000,
      stockQuantity: 30,
    },
    {
      name: 'Monitor',
      price: 15000,
      stockQuantity: 20,
    },
    {
      name: 'Headphones',
      price: 1000,
      stockQuantity: 0,
    },
    {
      name: 'CPU',
      price: 10000,
      stockQuantity: 20,
    },
  ];

  await productRepo.save(products);

  console.log('Products seeded successfully');
}
