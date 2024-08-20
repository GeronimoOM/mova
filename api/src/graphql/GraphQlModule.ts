import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { FastifyRequest } from 'fastify';
import { Context } from 'models/Context';
import { join } from 'path';
import { buildContext } from 'utils/context';
import { TimestampScalar } from './scalars/Timestamp';
import { validationPlugin } from './validation';

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
