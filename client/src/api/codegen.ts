import { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_URI } from './client';

const config: CodegenConfig = {
  schema: GRAPHQL_URI,
  //documents: ['src/**/*.tsx', 'src/**/*.ts'],
  documents: 'src/**/*.graphql',
  generates: {
    './src/api/types/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
