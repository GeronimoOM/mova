import { join } from 'path';
import { GraphQLModule as NestGraphQlModule } from '@nestjs/graphql';
import {
  MercuriusDriver,
  MercuriusDriverConfig,
  MercuriusPlugin,
} from '@nestjs/mercurius';
import { MercuriusValidationOptions } from 'mercurius-validation';
import mercuriusValidationPlugin from 'mercurius-validation';

export const GraphQLModule =
  NestGraphQlModule.forRootAsync<MercuriusDriverConfig>({
    driver: MercuriusDriver,
    useFactory: () => ({
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      graphiql: true,
      plugins: [validationPlugin],
    }),
  });

const validationPlugin: MercuriusPlugin<MercuriusValidationOptions> = {
  plugin: mercuriusValidationPlugin,
  options: {
    schema: {
      CreateLanguageInput: {
        name: { type: 'string', minLength: 3, maxLength: 20 },
      },
      UpdateLanguageInput: {
        name: { type: 'string', minLength: 3, maxLength: 20 },
      },
      CreatePropertyInput: {
        name: { type: 'string', minLength: 3, maxLength: 30 },
      },
      UpdatePropertyInput: {
        name: { type: 'string', minLength: 3, maxLength: 30 },
      },
      CreateTopicInput: {
        name: { type: 'string', minLength: 3, maxLength: 20 },
      },
    },
  },
};
