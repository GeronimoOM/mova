import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getContext } from 'middleware/ContextMiddleware';
import * as metadata from './metadata';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = metadata.isPublic(this.reflector, context);
    if (isPublic) {
      return true;
    }

    const ctx = getContext(context);
    const { user } = ctx;

    if (!user) {
      throw new UnauthorizedException();
    }

    const isAdmin = metadata.isPublic(this.reflector, context);
    if (isAdmin && !user.isAdmin) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
