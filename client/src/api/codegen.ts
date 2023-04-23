import { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_URI } from './client';

const config: CodegenConfig = {
  schema: GRAPHQL_URI,
  documents: 'src/**/*.graphql',
  generates: {
    './src/api/types/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
