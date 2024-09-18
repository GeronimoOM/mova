import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserAuth } from 'models/User';
import { UserService } from './UserService';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.getUserByUsername(username);

    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload: UserAuth = { userId: user.id };

    return await this.jwtService.signAsync(payload, {
      noTimestamp: true,
    });
  }

  async auth(token?: string): Promise<User | null> {
    let user: User | null = null;
    try {
      const { userId } = await this.jwtService.verifyAsync<UserAuth>(token, {
        secret: this.configService.get<string>('jwt.secret'),
        ignoreExpiration: true,
      });

      user = await this.userService.getUser(userId);
    } catch (e) {
      Logger.warn('Failed to authenticate:', e);
    }

    return user;
  }
}
