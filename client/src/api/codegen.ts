import { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_URI } from './client';

const config: CodegenConfig = {
  schema: `http://localhost${GRAPHQL_URI}`,
  documents: 'src/**/*.graphql',
  generates: {
    './src/api/types/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        scalars: {
          Timestamp: 'number',
        },
      },
    },
  },
};

export default config;
