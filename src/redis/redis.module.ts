import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            connectTimeout: 10000,
          },
        }),
        ttl: configService.get<number>('CACHE_TTL', 90000), // Default to 90 seconds if CACHE_TTL is not set
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class RedisModule {}
