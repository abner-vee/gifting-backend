import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PropertyService } from '../service/property.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreatePropertyRequest,
  PropertyResponse,
  UpdatePropertyRequest,
} from '../../common/dto';

@Controller('properties')
@ApiTags('Properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyRequest })
  @ApiOkResponse({
    description: 'Property created successfully',
    type: PropertyResponse,
  })
  async createProperty(@Body() req: CreatePropertyRequest) {
    const property = await this.propertyService.createProperty(req);
    return { message: 'Property created successfully', data: property };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiOkResponse({
    description: 'Property found',
    type: PropertyResponse,
  })
  async getPropertyById(@Param('id') propertyId: number) {
    const property = await this.propertyService.getPropertyById(propertyId);
    return { message: 'Property found', data: property };
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  async getAllProperties() {
    const properties = await this.propertyService.getAllProperties();
    return { message: 'Properties retrieved successfully', data: properties };
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update property' })
  @ApiBody({ type: UpdatePropertyRequest })
  async updateProperty(
    @Param('id') propertyId: number,
    @Body() updateData: UpdatePropertyRequest,
  ) {
    const property = await this.propertyService.updateProperty(
      propertyId,
      updateData,
    );
    return { message: 'Property updated successfully', data: property };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete property' })
  async deleteProperty(@Param('id') propertyId: number) {
    return await this.propertyService.deleteProperty(propertyId);
  }
}
