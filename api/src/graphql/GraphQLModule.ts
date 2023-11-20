import { join } from 'path';
import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { validationPlugin } from './validation';

export const GraphQLModule =
  NestGraphQlModule.forRootAsync<MercuriusDriverConfig>({
    driver: MercuriusDriver,
    useFactory: () => ({
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      graphiql: true,
      plugins: [validationPlugin],
      path: 'api/graphql',
    }),
  });
