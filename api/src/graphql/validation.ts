import { MercuriusPlugin } from '@nestjs/mercurius';
import mercuriusValidationPlugin, {
  MercuriusValidationOptions,
} from 'mercurius-validation';

export const validationPlugin: MercuriusPlugin<MercuriusValidationOptions> = {
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
    },
  },
};
