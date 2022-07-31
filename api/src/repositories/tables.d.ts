import { LanguageId } from 'src/models/Language';
import { PropertyId, PropertyType } from 'src/models/Property';
import { PartOfSpeech } from 'src/models/Word';

declare module 'knex/types/tables' {
    interface LanguageTable {
        id: LanguageId;
        name: string;
        added_at: number;
    }

    interface PropertyTable {
        id: PropertyId;
        name: string;
        type: PropertyType;
        language_id: LanguageId;
        part_of_speech: PartOfSpeech;
        added_at: number;
        data?: string;
    }

    interface WordTable {
        id: WordId;
        original: string;
        translation: string;
        language_id: LanguageId;
        part_of_speech: PartOfSpeech;
        added_at: number;
        properties?: string;
    }

    interface Tables {
        languages: LanguageTable;
        properties: PropertyTable;
        words: WordTable;
    }
}
