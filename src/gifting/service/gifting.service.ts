import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGiftingRequest } from '../../common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gift } from '../entity/gift.entity';
import { Repository } from 'typeorm';
import { Property } from '../entity/property.entity';
import { User } from '../../user/entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class GiftingService{
  constructor(
    @InjectRepository(Gift) private readonly gift: Repository<Gift>,
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(Property) private readonly property: Repository<Property>,
    private readonly mailerService: MailerService,
  ) {}
  async createGift(req: CreateGiftingRequest) {
    const { giverId, recipientEmail, propertyId } = req;
    const giver = await this.user.findOne({
      where: {
        id: giverId,
      },
    });
    const recipient = await this.user.findOne({
      where: {
        email: recipientEmail,
      },
    });
    const property = await this.property.findOne({
      where: {
        id: propertyId,
      },
    });

    if (!giver || !recipient || !property) {
      throw new Error('Invalid user or property');
    }

    const gift = this.gift.create({ giver, recipient, property });
    await this.gift.save(gift);
    return gift;
  }

  async getGiftById(giftingId: number) {
    const existingGift = await this.gift.findOne({
      where: {
        id: giftingId,
      },
    });
    if (!existingGift) {
      throw new HttpException({
          message: 'Gift not found',
          statusCode: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return existingGift;
  }
}
