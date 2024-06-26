import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'models/Context';

export const CONFIG_JWT_KEY = 'JWT_KEY';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext().ctx as Context;
    if (!ctx.jwtToken) {
      throw new UnauthorizedException();
    }
    try {
      await this.jwtService.verifyAsync(ctx.jwtToken, {
        secret: this.configService.get<string>(CONFIG_JWT_KEY),
        ignoreExpiration: true,
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
