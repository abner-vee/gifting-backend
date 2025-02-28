import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class APIResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  data?: T;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Static method to start the builder
  static builder<T>() {
    return new APIResponseBuilder<T>();
  }

  // Method to initialize instance within the builder only
  static initialize<T>(): APIResponse<T> {
    return new APIResponse<T>();
  }
}

class APIResponseBuilder<T> {
  private readonly instance: APIResponse<T>;

  constructor() {
    this.instance = APIResponse.initialize<T>(); // Correctly accesses the private constructor through a static method
  }

  statusCode(statusCode: number): this {
    this.instance.statusCode = statusCode;
    return this;
  }

  message(message: string): this {
    this.instance.message = message;
    return this;
  }

  data(data: T): this {
    this.instance.data = data;
    return this;
  }

  build(): APIResponse<T> {
    if (
      this.instance.statusCode === undefined ||
      this.instance.message === undefined
    ) {
      throw new Error('statusCode and message are required fields');
    }
    return this.instance;
  }
}


export class CreateGiftingRequest{
  @ApiProperty({ example: 1 })
  @IsOptional()
  giverId!: number;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsString()
  recipientEmail!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  propertyId!: number;
}

export class PropertyResponse {
  @ApiProperty({ example: 1, description: 'Unique identifier of the property' })
  id: number;

  @ApiProperty({ example: 'Luxury Apartment', description: 'Name of the property' })
  name: string;

  @ApiProperty({ example: 'A beautiful apartment with sea view', description: 'Short description of the property' })
  description: string;

  @ApiProperty({ example: 500000, description: 'Price of the property in USD' })
  price: number;
}

export class CreateUserRequest {
  @ApiProperty({ example: 'user@example.com', description: 'Unique email address of the user' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'securepassword', description: 'User password', minLength: 6 })
  @IsString()
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty({ example: 'newuser@example.com', description: 'Updated email of the user', required: false })
  email?: string;

  @ApiProperty({ example: 'newsecurepassword', description: 'Updated password', minLength: 6, required: false })
  password?: string;
}
export class LoginRequest {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'securepassword', description: 'User password' })
  @IsString()
  password: string;
}

export class AuthResponse {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  @IsNumber()
  id: number;
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  @IsString()
  email: string;
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  access_token: string;
}

export class UserResponse {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: () => [GiftingResponse],
    description: 'Gifts sent by the user',
  })
  @IsOptional()
  @IsObject()
  sentGifts: GiftingResponse[];

  @ApiProperty({
    type: () => [GiftingResponse],
    description: 'Gifts received by the user',
  })
  @IsOptional()
  @IsObject()
  receivedGifts: GiftingResponse[];
}

export class GiftingResponse {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the gift transaction',
  })
  id: number;

  @ApiProperty({
    type: () => UserResponse,
    description: 'User who sent the gift',
  })
  giver: UserResponse;

  @ApiProperty({
    type: () => UserResponse,
    description: 'User who received the gift',
  })
  recipient: UserResponse;

  @ApiProperty({
    type: () => PropertyResponse,
    description: 'The gifted property',
  })
  property: PropertyResponse;
}


export class CreatePropertyRequest {
  @ApiProperty({ example: 'Luxury Apartment', description: 'Name of the property' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A beautiful apartment with sea view', description: 'Short description of the property' })
  @IsString()
  description: string;

  @ApiProperty({ example: 500000, description: 'Price of the property in USD' })
  @IsNumber()
  price: number;
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL of the property image',
  })
  @IsString()
  @IsOptional()
  image: string;
}

export class UpdatePropertyRequest {
  @ApiProperty({
    example: 'Modern Villa',
    description: 'Updated name of the property',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Spacious villa with garden and pool',
    description: 'Updated description of the property',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 750000,
    description: 'Updated price of the property in USD',
    required: false,
  })
  price?: number;
}


