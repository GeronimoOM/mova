import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const CONFIG_AUTH_USER = 'AUTH_USER';
const CONFIG_AUTH_PASSWORD = 'AUTH_PASSWORD';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async auth(username: string, password: string): Promise<string> {
    if (
      username !== this.configService.get<string>(CONFIG_AUTH_USER) ||
      password !== this.configService.get<string>(CONFIG_AUTH_PASSWORD)
    ) {
      throw new UnauthorizedException();
    }

    const payload = { auth: true };

    return await this.jwtService.signAsync(payload);
  }
}
