import { Logger } from '@nestjs/common';
import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { join } from 'path';
import { TimestampScalar } from './scalars/Timestamp';
import { validationPlugin } from './validation';

export const GraphQlModule =
  NestGraphQlModule.forRootAsync<MercuriusDriverConfig>({
    driver: MercuriusDriver,
    useFactory: () => ({
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      path: 'api/graphql',
      plugins: [validationPlugin],
      resolvers: {
        Timestamp: TimestampScalar,
      },
      errorFormatter(executionResult) {
        const { errors, data, extensions } = executionResult;

        Logger.error('Unexpected error', errors);

        return {
          statusCode: 500,
          response: {
            data,
            errors,
            extensions,
          },
        };
      },
      graphiql: true,
    }),
  });
