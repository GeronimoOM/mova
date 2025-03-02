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
      CreateOptionInput: {
        value: { type: 'string', minLength: 1, maxLength: 30 },
      },
      UpdateOptionInput: {
        value: { type: 'string', maxLength: 30 },
      },
      CreateWordInput: {
        original: { type: 'string', minLength: 1, maxLength: 100 },
        translation: { type: 'string', minLength: 1, maxLength: 100 },
      },
      UpdateWordInput: {
        original: { type: 'string', maxLength: 100 },
        translation: { type: 'string', maxLength: 100 },
      },
      UpdatePropertyValueInput: {
        text: { type: 'string', maxLength: 100 },
      },
      UpdatePropertyValueOptionInput: {
        value: { type: 'string', maxLength: 30 },
      },
    },
  },
};
