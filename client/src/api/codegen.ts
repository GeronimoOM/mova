import { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_URI } from './client';

const config: CodegenConfig = {
  schema: GRAPHQL_URI,
  documents: 'src/**/*.graphql',
  generates: {
    './src/api/types/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
