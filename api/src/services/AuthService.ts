import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserAuth } from 'models/User';
import { EncryptionService } from './EncryptionService';
import { UserService } from './UserService';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private cryptService: EncryptionService,
  ) {}

  async login(name: string, password: string): Promise<string> {
    const user = await this.userService.getUserByName(name);
    const isValid = user && (await this.verifyPassword(user, password));

    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload: UserAuth = { userId: user.id };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      noTimestamp: true,
    });
  }

  async auth(token?: string): Promise<User | null> {
    let user: User | null = null;
    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const { userId } = await this.jwtService.verifyAsync<UserAuth>(token, {
        secret: this.configService.get<string>('jwt.secret'),
        ignoreExpiration: true,
      });

      user = await this.userService.getById(userId);
    } catch (e) {
      Logger.warn('Failed to authenticate:', e);
    }

    return user;
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    if (user.isAdmin) {
      return user.password === password;
    }

    return this.cryptService.verify(user.password, password);
  }
}
