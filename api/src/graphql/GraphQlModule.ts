import { join } from 'path';
import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { validationPlugin } from './validation';
import { TimestampScalar } from './scalars/Timestamp';
import { Context } from 'models/Context';
import { HEADER_AUTHORIZATION, HEADER_SYNC_CLIENT_ID } from 'utils/constants';

export const GraphQlModule =
  NestGraphQlModule.forRootAsync<MercuriusDriverConfig>({
    driver: MercuriusDriver,
    useFactory: () => ({
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      path: 'api/graphql',
      plugins: [validationPlugin],
      resolvers: {
        Timestamp: TimestampScalar,
      },
      context: (
        request: FastifyRequest,
      ): {
        ctx: Context;
      } => ({
        ctx: buildContext(request),
      }),
      graphiql: true,
    }),
  });

function buildContext(request: FastifyRequest): Context {
  const [type, token] = request.headers[HEADER_AUTHORIZATION]?.split(' ') ?? [];

  return {
    jwtToken: type === 'Bearer' ? token : undefined,
    clientId: request.headers[HEADER_SYNC_CLIENT_ID] as string,
  };
}
