import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserAuth } from 'models/User';

@Injectable()
export class AuthService {
  private users: User[];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.users = this.configService.get<User[]>('users');
  }

  async login(username: string, password: string): Promise<string> {
    const user = this.users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!user) {
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

      user = this.users.find((user) => user.id === userId) ?? null;
    } catch (e) {
      Logger.warn('Failed to authenticate:', e);
    }

    return user;
  }
}
