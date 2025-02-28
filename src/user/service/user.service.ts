import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { AuthResponse, CreateUserRequest, LoginRequest, UpdateUserRequest, UserResponse } from '../../common/dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/service/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  async createUser(req: CreateUserRequest): Promise<UserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.password, 10);
    const user = this.userRepository.create({
      ...req,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    // Send Welcome Email
    await this.mailerService.sendEmail({
      subject: 'Welcome to Our Platform',
      templateName: 'welcome', // You need to create this template
      placeHolderData: { email: savedUser.email },
      sendNow: true,
      receiverEmail: savedUser.email,
      senderEmail: 'noreply@yourapp.com',
    });

    const { password, ...res } = savedUser;
    return res;
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({ where: { email: req.email } });
    if (!user || !(await bcrypt.compare(req.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1h',
    });

    // Store token in cache for session management
    await this.cacheManager.set(`token:${user.id}`, accessToken);

    // Send Login Notification Email
    await this.mailerService.sendEmail({
      subject: 'New Login Detected',
      templateName: 'login-notification', // Create this template
      placeHolderData: { email: user.email },
      sendNow: true,
      receiverEmail: user.email,
      senderEmail: 'noreply@yourapp.com',
    });

    return { access_token: accessToken, id: user.id, email: user.email };
  }

  async logout(userId: number): Promise<{ message: string }> {
    const user = await this.getUserById(userId);

    // Remove token from cache
    await this.cacheManager.del(`token:${user.id}`);

    return { message: 'Logged out successfully' };
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUser(userId: number, updateData: UpdateUserRequest): Promise<User> {
    const user = await this.getUserById(userId);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.getUserById(userId);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
