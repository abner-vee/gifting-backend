import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserRequest,
  UserResponse,
  UpdateUserRequest,
  LoginRequest,
  AuthResponse,
} from '../../common/dto';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserRequest })
  @ApiOkResponse({
    description: 'User created successfully',
    type: UserResponse,
  })
  async createUser(@Body() req: CreateUserRequest) {
    const user = await this.userService.createUser(req);
    return { message: 'User created successfully', data: user };
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginRequest })
  @ApiOkResponse({ description: 'User authenticated successfully', type: AuthResponse })
  async login(@Body() req: LoginRequest) {
    return await this.userService.login(req);
  }

  @Post('/logout/:id')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Param('id') userId: number) {
    return await this.userService.logout(userId);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User found', type: UserResponse })
  async getUserById(@Param('id') userId: number) {
    const user = await this.userService.getUserById(userId);
    return { message: 'User found', data: user };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return { message: 'Users retrieved successfully', data: users };
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiBody({ type: UpdateUserRequest })
  async updateUser(
    @Param('id') userId: number,
    @Body() updateData: UpdateUserRequest,
  ) {
    const user = await this.userService.updateUser(userId, updateData);
    return { message: 'User updated successfully', data: user };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
