import { ChangeId } from 'models/Change';
import { LanguageId } from 'models/Language';
import { PropertyId, PropertyType } from 'models/Property';
import { PartOfSpeech, WordId } from 'models/Word';

declare module 'knex/types/tables' {
  interface LanguageTable {
    id: LanguageId;
    name: string;
    added_at: string;
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
    mastery: number;
    added_at: string;
    properties?: string;
  }

  interface ChangeTable {
    id: ChangeId;
    changed_at: string;
    type: string;
    client_id?: string;
    data?: string;
  }

  interface Tables {
    languages: LanguageTable;
    properties: PropertyTable;
    words: WordTable;
  }
}
