import { HttpException, Logger } from '@nestjs/common';
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
        const [error] = errors;
        const originalError = error.originalError;

        const isHttpError = originalError instanceof HttpException;
        if (!isHttpError) {
          Logger.error('Unexpected error', error);
        }

        return {
          statusCode: (originalError as HttpException).getStatus() ?? 500,
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
