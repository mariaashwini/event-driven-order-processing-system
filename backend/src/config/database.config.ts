import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'admin@07',
  database: process.env.DB_NAME || 'order_processing_system',
}));