import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    // Create a custom token extraction function that logs the extracted token
    const customExtractJwt = (req: Request) => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (token) {
        console.log('Extracted Token:', token);
      } else {
        console.error('No token found in the Authorization header');
      }
      return token;
    };

    super({
      jwtFromRequest: customExtractJwt,
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync('private.key', 'utf8'), // Load the private key securely
      algorithms: ['RS256'],
    });

    // Log that the strategy has been initialized
    this.logger.log('JwtStrategy initialized successfully.');
  }

  validate(payload: any) {
    // Log the decoded payload to check its contents
    this.logger.log(`Decoded JWT Payload: ${JSON.stringify(payload)}`);

    if (!payload) {
      this.logger.error('Invalid JWT: No payload found.');
      throw new UnauthorizedException('Invalid JWT payload.');
    }

    // Construct the user object based on the payload
    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    // Log the validated user information
    this.logger.log(`Validated User: ${JSON.stringify(user)}`);

    return user; // This user object will be attached to the request
  }
}
