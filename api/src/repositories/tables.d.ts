import { ChangeId } from 'models/Change';
import { LanguageId } from 'models/Language';
import { ProgressId } from 'models/Progress';
import { PropertyId, PropertyType } from 'models/Property';
import { PartOfSpeech, WordId } from 'models/Word';

declare module 'knex/types/tables' {
  interface LanguageTable {
    id: LanguageId;
    name: string;
    added_at: string;
    user_id: string;
  }

  interface PropertyTable {
    id: PropertyId;
    name: string;
    type: PropertyType;
    language_id: LanguageId;
    part_of_speech: PartOfSpeech;
    order: number;
    added_at: string;
    data?: string;
  }

  interface WordTable {
    id: WordId;
    original: string;
    translation: string;
    language_id: LanguageId;
    part_of_speech: PartOfSpeech;
    added_at: string;
    mastery: number;
    mastery_inc_at?: string;
    mastery_attempt_at?: string;
    properties?: string;
  }

  interface ProgressTable {
    id: ProgressId;
    date: string;
    type: ProgressType;
    language_id: LanguageId;
  }

  interface GoalTable {
    type: ProgressType;
    cadence: ProgressCadence;
    points: number;
    language_id: LanguageId;
  }

  interface UserSettingsTable {
    user_id: UserId;
    settings?: string;
  }

  interface ChangeTable {
    id: ChangeId;
    changed_at: string;
    type: string;
    client_id?: string;
    data?: string;
    user_id: string;
  }

  interface Tables {
    languages: LanguageTable;
    properties: PropertyTable;
    words: WordTable;
    progress: ProgressTable;
    goals: GoalTable;
    changes: ChangeTable;
  }
}
