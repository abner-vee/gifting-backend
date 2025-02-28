import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entity/property.entity';
import { CreatePropertyRequest, UpdatePropertyRequest } from '../../common/dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async createProperty(req: CreatePropertyRequest): Promise<Property> {
    const property = this.propertyRepository.create(req);
    return await this.propertyRepository.save(property);
  }

  async getPropertyById(propertyId: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (!property) {
      throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
    }
    return property;
  }

  async getAllProperties(): Promise<Property[]> {
    return await this.propertyRepository.find();
  }

  async updateProperty(
    propertyId: number,
    updateData: UpdatePropertyRequest,
  ): Promise<Property> {
    const property = await this.getPropertyById(propertyId);
    Object.assign(property, updateData);
    return await this.propertyRepository.save(property);
  }

  async deleteProperty(propertyId: number): Promise<{ message: string }> {
    const property = await this.getPropertyById(propertyId);
    await this.propertyRepository.remove(property);
    return { message: 'Property deleted successfully' };
  }
}
