import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Gift } from './entity/gift.entity';
import { Property } from './entity/property.entity';
import { GiftingController } from './controller/gifting.controller';
import { GiftingService } from './service/gifting.service';
import { PropertyController } from './controller/property.controller';
import { PropertyService } from './service/property.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User, Gift, Property])],
  providers: [GiftingService, PropertyService],
  exports: [GiftingService, PropertyService],
  controllers: [GiftingController, PropertyController],
})
export class GiftingModule {}
