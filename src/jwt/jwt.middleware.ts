import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { JwtPayload } from '../common/enums';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const publicKey = fs.readFileSync('public.key', 'utf8'); // Ensure this key matches the key used to sign your JWTs

    try {
      const payload: JwtPayload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload;
      console.log('JWT Payload:', payload);
      req['user'] = payload;
      next();
    } catch (error: any) {
      console.error('JWT Verification Error:', error?.message);
      throw new UnauthorizedException('Invalid or expired JWT');
    }
  }
}
