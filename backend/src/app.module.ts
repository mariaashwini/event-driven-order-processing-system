import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { typeOrmConfig } from './typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { eventEmitterConfig } from './config/event-emitter.config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
      load: [databaseConfig]
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),

    EventEmitterModule.forRoot(eventEmitterConfig),
    OrdersModule,
    InventoryModule,
    NotificationsModule,
    AnalyticsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
