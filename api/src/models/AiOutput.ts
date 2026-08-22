import { Flavor } from 'utils/flavor';

export type AiOutputKey = Flavor<string, 'AiOutput'>;

export enum AiOutputType {
  WordUsage = 'word_usage',
}
