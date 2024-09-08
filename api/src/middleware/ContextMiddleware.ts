import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Context } from 'models/Context';
import { AuthService } from 'services/AuthService';
import {
  HEADER_AUTHORIZATION,
  HEADER_SYNC_CLIENT_ID,
  HEADER_TIMEZONE,
} from 'utils/constants';

export function getContext(context: ExecutionContext) {
  let request: FastifyRequest;
  if (context.getType() === 'http') {
    request = context.switchToHttp().getRequest();
  } else if (context.getType<GqlContextType>() === 'graphql') {
    request = GqlExecutionContext.create(context).getContext().req;
  }

  return (request['raw'] as FastifyRequest['raw'] & { ctx: Context }).ctx;
}

export const ContextDec = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return getContext(context);
  },
);

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    request: FastifyRequest['raw'] & { ctx: Context },
    _: FastifyReply['raw'],
    next: () => void,
  ) {
    const [type, token] =
      request.headers[HEADER_AUTHORIZATION]?.split(' ') ?? [];
    const jwtToken = type === 'Bearer' ? token : undefined;
    const user = await this.authService.auth(jwtToken);

    request.ctx = {
      user,
      clientId: request.headers[HEADER_SYNC_CLIENT_ID] as string,
      timezone: request.headers[HEADER_TIMEZONE] as string,
    };

    next();
  }
}
