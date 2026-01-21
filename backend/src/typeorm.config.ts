import { DataSourceOptions } from 'typeorm';
import databaseConfig from './config/database.config';
import { Product } from './database/entities/product.entity';
import { Order } from './database/entities/order.entity';
import { OrderItem } from './database/entities/order-item.entity';

export const typeOrmConfig = (): DataSourceOptions => {
  const db = databaseConfig();

  return {
    type: 'mariadb',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,

    entities: [Product, Order, OrderItem],

    synchronize: true, // true for development purpose only
    logging: true,
  };
};
