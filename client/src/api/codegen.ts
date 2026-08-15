import { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_URI } from './client';

const config: CodegenConfig = {
  schema: `http://localhost${GRAPHQL_URI}`,
  documents: 'src/**/*.graphql',
  generates: {
    './src/api/types/schema.ts': {
      plugins: ['typescript'],
      config: {
        nonOptionalTypename: true,
        scalars: {
          Timestamp: 'string',
        },
      },
    },
    './src/api/types/operations.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        importSchemaTypesFrom: './src/api/types/schema.ts',
        arrayInputCoercion: false,
        enumType: 'native',
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        maybeValue: 'T | null | undefined',
        scalars: {
          ID: 'string',
          Timestamp: 'string',
        },
      },
    },
  },
};

export default config;
