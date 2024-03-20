import { join } from 'path';
import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { validationPlugin } from './validation';
import { TimestampScalar } from './scalars/Timestamp';
import { Context } from 'models/Context';
import { SYNC_CLIENT_ID_HEADER } from 'utils/constants';

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
      context: (request: FastifyRequest): { ctx: Context } => ({
        ctx: buildContext(request),
      }),
      graphiql: true,
    }),
  });

function buildContext(request: FastifyRequest): Context {
  return {
    clientId: request.headers[SYNC_CLIENT_ID_HEADER] as string,
  };
}
