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
      graphiql: true,
    }),
  });
