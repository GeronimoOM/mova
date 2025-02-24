import { MercuriusPlugin } from '@nestjs/mercurius';
import mercuriusValidationPlugin, {
  MercuriusValidationOptions,
} from 'mercurius-validation';

export const validationPlugin: MercuriusPlugin<MercuriusValidationOptions> = {
  plugin: mercuriusValidationPlugin,
  options: {
    schema: {
      Query: {
        words: {
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
        changes: {
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
      },
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
    },
  },
};
