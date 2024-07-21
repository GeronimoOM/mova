import { Static, Type } from '@sinclair/typebox';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT_REGEX } from 'utils/constants';
import { Language, LanguageId, LanguageUpdate } from './Language';
import { Page } from './Page';
import {
  PropertiesReorder,
  Property,
  PropertyId,
  PropertyUpdate,
} from './Property';
import { WordCreate, WordId, WordUpdate } from './Word';

export type ChangeId = LanguageId | PropertyId | WordId;

export interface BaseChange {
  id: ChangeId;
  changedAt: DateTime;
  type: ChangeType;
  clientId?: string;
}

export enum ChangeType {
  CreateLanguage = 'language:create',
  UpdateLanguage = 'language:update',
  DeleteLanguage = 'language:delete',
  CreateProperty = 'property:create',
  UpdateProperty = 'property:update',
  ReorderProperties = 'property:reorder',
  DeleteProperty = 'property:delete',
  CreateWord = 'word:create',
  UpdateWord = 'word:update',
  DeleteWord = 'word:delete',
}

export interface CreateLanguageChange extends BaseChange {
  type: ChangeType.CreateLanguage;
  created: Language;
}

export interface UpdateLanguageChange extends BaseChange {
  type: ChangeType.UpdateLanguage;
  updated: LanguageUpdate;
}

export interface DeleteLanguageChange extends BaseChange {
  type: ChangeType.DeleteLanguage;
  deleted: LanguageId;
}

export interface CreatePropertyChange extends BaseChange {
  type: ChangeType.CreateProperty;
  created: Property;
}

export interface UpdatePropertyChange extends BaseChange {
  type: ChangeType.UpdateProperty;
  updated: PropertyUpdate;
}

export interface ReorderPropertiesChange extends BaseChange {
  type: ChangeType.ReorderProperties;
  reordered: PropertiesReorder;
}

export interface DeletePropertyChange extends BaseChange {
  type: ChangeType.DeleteProperty;
  deleted: PropertyId;
}

export interface CreateWordChange extends BaseChange {
  type: ChangeType.CreateWord;
  created: WordCreate;
}

export interface UpdateWordChange extends BaseChange {
  type: ChangeType.UpdateWord;
  updated: WordUpdate;
}

export interface DeleteWordChange extends BaseChange {
  type: ChangeType.DeleteWord;
  deleted: WordId;
}

export type Change =
  | CreateLanguageChange
  | UpdateLanguageChange
  | DeleteLanguageChange
  | CreatePropertyChange
  | UpdatePropertyChange
  | ReorderPropertiesChange
  | DeletePropertyChange
  | CreateWordChange
  | UpdateWordChange
  | DeleteWordChange;

export interface ChangePage extends Page<Change, ChangeCursor> {
  syncType: SyncType;
}

export enum SyncType {
  Full = 'full',
  Delta = 'delta',
}

export type ChangeCursor = Static<typeof ChangeCursor>;
export const ChangeCursor = Type.Object({
  changedAt: Type.RegExp(DATETIME_FORMAT_REGEX),
  id: Type.String(),
});
