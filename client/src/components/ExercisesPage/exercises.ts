import {
  WordFieldsFullFragment,
  WordFieldsLinksFragment,
} from '../../api/types/graphql';

export type ExerciseWord = WordFieldsFullFragment & WordFieldsLinksFragment;
