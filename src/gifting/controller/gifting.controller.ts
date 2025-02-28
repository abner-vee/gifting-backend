import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GiftingService } from '../service/gifting.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  APIResponse,
  CreateGiftingRequest,
  GiftingResponse,
} from '../../common/dto';

@Controller('gifts')
@ApiTags('Gifting')
export class GiftingController {
  constructor(private readonly giftingService: GiftingService) {}
  @Post('')
  @ApiOperation({ summary: 'Create Gifting' })
  @ApiBody({ type: CreateGiftingRequest })
  @ApiOkResponse({
    description: 'Gift created successfully',
    type: APIResponse,
  })
  async createGifting(
    @Body() req: CreateGiftingRequest,
  ): Promise<APIResponse<GiftingResponse>> {
    const res = await this.giftingService.createGift(req);
    return APIResponse.builder<GiftingResponse>()
      .message('Gifting created successfully')
      .data({ ...res })
      .statusCode(201)
      .build();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Gift by ID' })
  @ApiOkResponse({
    description: 'Gift found',
    type: APIResponse,
  })
  async getGiftingById(@Param('giftingId') giftingId: number){
    const res = await this.giftingService.getGiftById(giftingId);
    return APIResponse.builder<GiftingResponse>()
      .message('Gift found')
      .data({ ...res })
      .statusCode(200)
      .build();
  }
}
