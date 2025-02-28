import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomConfigModule } from '../custom-config/custom-config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', '1234'),
        database: configService.get<string>('DATABASE_NAME', 'auth_db'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    })],
})
export class DatabaseConfigModule {
}
