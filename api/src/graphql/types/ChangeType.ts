import {
  Field,
  ID,
  InputType,
  Int,
  InterfaceType,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import {
  Change,
  ChangeId,
  ChangeType,
  ChangeType as ChangeTypeEnum,
  SyncType,
} from 'models/Change';
import { Color } from 'models/Color';
import { LanguageId } from 'models/Language';
import {
  OptionId,
  PropertyId,
  PropertyType,
  PropertyUpdate,
} from 'models/Property';
import { PropertyValueSave } from 'models/PropertyValue';
import { PartOfSpeech, WordId } from 'models/Word';
import {
  CreateLanguageInput,
  DeleteLanguageInput,
  LanguageType,
  UpdateLanguageInput,
} from './LanguageType';
import {
  CreatePropertyInput,
  DeletePropertyInput,
  PropertyUnionType,
  ReorderPropertiesInput,
  UpdatePropertyInput,
} from './PropertyType';
import {
  CreateWordLinkInput,
  DeleteWordLinkInput,
  WordLinkObjectType,
} from './WordLinkType';
import { CreateWordInput, DeleteWordInput, UpdateWordInput } from './WordType';

registerEnumType(ChangeTypeEnum, {
  name: 'ChangeType',
});

registerEnumType(SyncType, {
  name: 'SyncType',
});

@InterfaceType('IChange')
export abstract class ChangeInterface {
  @Field(() => ID)
  id: ChangeId;

  @Field(() => TimestampScalar)
  changedAt: DateTime;

  @Field(() => ChangeTypeEnum)
  type: ChangeTypeEnum;
}

@ObjectType('CreateLanguageChange', {
  implements: () => ChangeInterface,
})
export class CreateLanguageChangeType extends ChangeInterface {
  @Field()
  created: LanguageType;
}

@ObjectType('LanguageUpdate')
export class LanguageUpdateType {
  @Field(() => ID)
  id: LanguageId;

  @Field()
  name: string;
}

@ObjectType('UpdateLanguageChange', {
  implements: () => ChangeInterface,
})
export class UpdateLanguageChangeType extends ChangeInterface {
  @Field()
  updated: LanguageUpdateType;
}

@ObjectType('DeleteLanguageChange', {
  implements: () => ChangeInterface,
})
export class DeleteLanguageChangeType extends ChangeInterface {
  @Field(() => ID)
  deleted: LanguageId;
}

@ObjectType('CreatePropertyChange', {
  implements: () => ChangeInterface,
})
export class CreatePropertyChangeType extends ChangeInterface {
  @Field(() => PropertyUnionType)
  created: typeof PropertyUnionType;
}

@InterfaceType('IPropertyUpdate')
export abstract class PropertyUpdateInterface {
  @Field(() => ID)
  id: PropertyId;

  @Field(() => PropertyType)
  type: PropertyType;

  @Field({ nullable: true })
  name?: string;
}

@ObjectType('TextPropertyUpdate', {
  implements: () => PropertyUpdateInterface,
})
export class TextPropertyUpdateType extends PropertyUpdateInterface {}

@ObjectType('OptionPropertyUpdate', {
  implements: () => PropertyUpdateInterface,
})
export class OptionPropertyUpdateType extends PropertyUpdateInterface {
  @Field(() => [OptionUpdateType], { nullable: true })
  options?: OptionUpdateType[];
}

@ObjectType('OptionUpdate')
export class OptionUpdateType {
  @Field(() => ID)
  id: OptionId;

  @Field({ nullable: true })
  value?: string;

  @Field(() => Color, { nullable: true })
  color?: Color;
}

export const PropertyUpdateUnionType = createUnionType({
  name: 'PropertyUpdate',
  types: () => [TextPropertyUpdateType, OptionPropertyUpdateType] as const,
  resolveType: (value: PropertyUpdate) => {
    switch (value.type) {
      case PropertyType.Text:
        return TextPropertyUpdateType;
      case PropertyType.Option:
        return OptionPropertyUpdateType;
    }
  },
});

@ObjectType('UpdatePropertyChange', {
  implements: () => ChangeInterface,
})
export class UpdatePropertyChangeType extends ChangeInterface {
  @Field(() => PropertyUpdateUnionType)
  updated: typeof PropertyUpdateUnionType;
}

@ObjectType('PropertiesReorder')
export class PropertiesReorderType {
  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => [ID])
  propertyIds: PropertyId[];
}

@ObjectType('ReorderPropertiesChange', {
  implements: () => ChangeInterface,
})
export class ReorderPropertiesChangeType extends ChangeInterface {
  @Field()
  reordered: PropertiesReorderType;
}

@ObjectType('DeletePropertyChange', {
  implements: () => ChangeInterface,
})
export class DeletePropertyChangeType extends ChangeInterface {
  @Field(() => ID)
  deleted: PropertyId;
}

@InterfaceType('IPropertyValueSave')
export abstract class PropertyValuesSaveInterface {
  @Field(() => ID)
  propertyId: PropertyId;

  @Field(() => PropertyType)
  type: PropertyType;
}

@ObjectType('TextPropertyValueSave', {
  implements: () => PropertyValuesSaveInterface,
})
export class TextPropertyValueSaveType extends PropertyValuesSaveInterface {
  @Field({ nullable: true })
  text?: string;
}

@ObjectType('OptionPropertyValueSave', {
  implements: () => PropertyValuesSaveInterface,
})
export class OptionPropertyValueSaveType extends PropertyValuesSaveInterface {
  @Field(() => ID, { nullable: true })
  optionId?: OptionId;

  @Field({ nullable: true })
  value?: string;

  @Field(() => Color, { nullable: true })
  color?: Color;
}

export const PropertyValueSaveUnionType = createUnionType({
  name: 'PropertyValueSave',
  types: () =>
    [TextPropertyValueSaveType, OptionPropertyValueSaveType] as const,
  resolveType: (value: PropertyValueSave) => {
    switch (value.type) {
      case PropertyType.Text:
        return TextPropertyValueSaveType;
      case PropertyType.Option:
        return OptionPropertyValueSaveType;
    }
  },
});

@ObjectType('WordCreate')
export class WordCreateType {
  @Field(() => ID)
  id: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => TimestampScalar)
  addedAt: DateTime;

  @Field(() => Int)
  mastery: number;

  @Field(() => Int)
  confidence: number;

  @Field(() => TimestampScalar)
  nextExerciseAt: DateTime;

  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => [PropertyValueSaveUnionType])
  properties: Array<typeof PropertyValueSaveUnionType>;
}

@ObjectType('CreateWordChange', {
  implements: () => ChangeInterface,
})
export class CreateWordChangeType extends ChangeInterface {
  @Field()
  created: WordCreateType;
}

@ObjectType('WordUpdate')
export class WordUpdateType {
  @Field(() => ID)
  id: WordId;

  @Field({ nullable: true })
  original?: string;

  @Field({ nullable: true })
  translation?: string;

  @Field(() => [PropertyValueSaveUnionType], { nullable: true })
  properties?: Array<typeof PropertyValueSaveUnionType>;

  @Field(() => Int, { nullable: true })
  mastery?: number;

  @Field(() => Int, { nullable: true })
  confidence?: number;

  @Field(() => TimestampScalar, { nullable: true })
  nextExerciseAt?: DateTime;
}

@ObjectType('UpdateWordChange', {
  implements: () => ChangeInterface,
})
export class UpdateWordChangeType extends ChangeInterface {
  @Field()
  updated: WordUpdateType;
}

@ObjectType('DeleteWordChange', {
  implements: () => ChangeInterface,
})
export class DeleteWordChangeType extends ChangeInterface {
  @Field(() => ID)
  deleted: WordId;
}

@ObjectType('CreateWordLinkChange', {
  implements: () => ChangeInterface,
})
export class CreateWordLinkChangeType extends ChangeInterface {
  @Field()
  created: WordLinkObjectType;
}

@ObjectType('DeleteWordLinkChange', {
  implements: () => ChangeInterface,
})
export class DeleteWordLinkChangeType extends ChangeInterface {
  @Field()
  deleted: WordLinkObjectType;
}

export const ChangeUnionType = createUnionType({
  name: 'Change',
  types: () =>
    [
      CreateLanguageChangeType,
      UpdateLanguageChangeType,
      DeleteLanguageChangeType,
      CreatePropertyChangeType,
      UpdatePropertyChangeType,
      ReorderPropertiesChangeType,
      DeletePropertyChangeType,
      CreateWordChangeType,
      UpdateWordChangeType,
      DeleteWordChangeType,
      CreateWordLinkChangeType,
      DeleteWordLinkChangeType,
    ] as const,
  resolveType: (value: Change) => {
    switch (value.type) {
      case ChangeType.CreateLanguage:
        return CreateLanguageChangeType;
      case ChangeType.UpdateLanguage:
        return UpdateLanguageChangeType;
      case ChangeType.DeleteLanguage:
        return DeleteLanguageChangeType;
      case ChangeType.CreateProperty:
        return CreatePropertyChangeType;
      case ChangeType.UpdateProperty:
        return UpdatePropertyChangeType;
      case ChangeType.ReorderProperties:
        return ReorderPropertiesChangeType;
      case ChangeType.DeleteProperty:
        return DeletePropertyChangeType;
      case ChangeType.CreateWord:
        return CreateWordChangeType;
      case ChangeType.UpdateWord:
        return UpdateWordChangeType;
      case ChangeType.DeleteWord:
        return DeleteWordChangeType;
      case ChangeType.CreateWordLink:
        return CreateWordLinkChangeType;
      case ChangeType.DeleteWordLink:
        return DeleteWordLinkChangeType;
    }
  },
});

@ObjectType('ChangePage')
export class ChangePageType {
  @Field(() => [ChangeUnionType])
  items: Array<typeof ChangeUnionType>;

  @Field({ nullable: true })
  nextCursor?: string;

  @Field(() => SyncType)
  syncType: SyncType;
}

@InputType()
export class ApplyChangeInput {
  @Field(() => CreateLanguageInput, { nullable: true })
  createLanguage: CreateLanguageInput;

  @Field(() => UpdateLanguageInput, { nullable: true })
  updateLanguage: UpdateLanguageInput;

  @Field(() => DeleteLanguageInput, { nullable: true })
  deleteLanguage: DeleteLanguageInput;

  @Field(() => CreatePropertyInput, { nullable: true })
  createProperty: CreatePropertyInput;

  @Field(() => UpdatePropertyInput, { nullable: true })
  updateProperty: UpdatePropertyInput;

  @Field(() => ReorderPropertiesInput, { nullable: true })
  reorderProperties: ReorderPropertiesInput;

  @Field(() => DeletePropertyInput, { nullable: true })
  deleteProperty: DeletePropertyInput;

  @Field(() => CreateWordInput, { nullable: true })
  createWord: CreateWordInput;

  @Field(() => UpdateWordInput, { nullable: true })
  updateWord: UpdateWordInput;

  @Field(() => DeleteWordInput, { nullable: true })
  deleteWord: DeleteWordInput;

  @Field(() => CreateWordLinkInput, { nullable: true })
  createWordLink: CreateWordLinkInput;

  @Field(() => DeleteWordLinkInput, { nullable: true })
  deleteWordLink: DeleteWordLinkInput;
}
