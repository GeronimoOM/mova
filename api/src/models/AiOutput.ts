import { Flavor } from 'utils/flavor';

export type AiOutputKey = Flavor<string, 'AiOutput'>;

export enum AiOutputType {
  WordOverview = 'word_overview',
}
