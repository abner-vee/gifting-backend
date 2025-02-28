import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfigModule } from './database-config/database-config.module';
import { CustomConfigModule } from './custom-config/custom-config.module';
import { UserModule } from './user/user.module';
import { GiftingModule } from './gifting/gifting.module';
import { RedisModule } from './redis/redis.module';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    DatabaseConfigModule,
    CustomConfigModule,
    UserModule,
    GiftingModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
