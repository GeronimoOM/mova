import { FastifyRequest } from 'fastify';
import { Context } from 'models/Context';
import {
  HEADER_AUTHORIZATION,
  HEADER_SYNC_CLIENT_ID,
  HEADER_TIMEZONE,
} from 'utils/constants';

export function buildContext(request: FastifyRequest): Context {
  const [type, token] = request.headers[HEADER_AUTHORIZATION]?.split(' ') ?? [];

  return {
    jwtToken: type === 'Bearer' ? token : undefined,
    clientId: request.headers[HEADER_SYNC_CLIENT_ID] as string,
    timezone: request.headers[HEADER_TIMEZONE] as string,
  };
}
