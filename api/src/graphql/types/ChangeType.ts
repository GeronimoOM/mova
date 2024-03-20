import {
  Field,
  ID,
  InputType,
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
import { LanguageId } from 'models/Language';
import {
  CreateLanguageInput,
  DeleteLanguageInput,
  LanguageType,
  UpdateLanguageInput,
} from './LanguageType';
import {
  OptionId,
  PropertyId,
  PropertyType,
  PropertyUpdate,
} from 'models/Property';
import {
  CreatePropertyInput,
  DeletePropertyInput,
  OptionType,
  PropertyUnionType,
  ReorderPropertiesInput,
  UpdatePropertyInput,
} from './PropertyType';
import { PartOfSpeech, WordId } from 'models/Word';
import { PropertyValueSave } from 'models/PropertyValue';
import { CreateWordInput, DeleteWordInput, UpdateWordInput } from './WordType';

registerEnumType(ChangeTypeEnum, {
  name: 'ChangeType',
});

registerEnumType(SyncType, {
  name: 'SyncType',
});

@InterfaceType('IChange')
export abstract class ChangeInterface {
  @Field((type) => ID)
  id: ChangeId;

  @Field((type) => TimestampScalar)
  changedAt: DateTime;

  @Field((type) => ChangeTypeEnum)
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
  @Field((type) => ID)
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
  @Field((type) => ID)
  deleted: LanguageId;
}

@ObjectType('CreatePropertyChange', {
  implements: () => ChangeInterface,
})
export class CreatePropertyChangeType extends ChangeInterface {
  @Field((type) => PropertyUnionType)
  created: typeof PropertyUnionType;
}

@InterfaceType('IPropertyUpdate')
export abstract class PropertyUpdateInterface {
  @Field((type) => ID)
  id: PropertyId;

  @Field((type) => PropertyType)
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
  @Field((type) => [OptionType], { nullable: true })
  options?: OptionType[];
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
  @Field((type) => PropertyUpdateUnionType)
  updated: typeof PropertyUpdateUnionType;
}

@ObjectType('PropertiesReorder')
export class PropertiesReorderType {
  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => [ID])
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
  @Field((type) => ID)
  deleted: PropertyId;
}

@InterfaceType('IPropertyValueSave')
export abstract class PropertyValuesSaveInterface {
  @Field((type) => ID)
  propertyId: PropertyId;

  @Field((type) => PropertyType)
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
  @Field((type) => ID, { nullable: true })
  optionId?: OptionId;
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
  @Field((type) => ID)
  id: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar)
  addedAt: DateTime;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => [PropertyValueSaveUnionType])
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
  @Field((type) => ID)
  id: WordId;

  @Field({ nullable: true })
  original?: string;

  @Field({ nullable: true })
  translation?: string;

  @Field((type) => [PropertyValueSaveUnionType], { nullable: true })
  properties?: Array<typeof PropertyValueSaveUnionType>;
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
  @Field((type) => ID)
  deleted: WordId;
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
    }
  },
});

@ObjectType('ChangePage')
export class ChangePageType {
  @Field((type) => [ChangeUnionType])
  items: Array<typeof ChangeUnionType>;

  @Field({ nullable: true })
  nextCursor?: string;

  @Field((type) => SyncType)
  syncType: SyncType;
}

@InputType()
export class ApplyChangeInput {
  @Field((type) => CreateLanguageInput, { nullable: true })
  createLanguage: CreateLanguageInput;

  @Field((type) => UpdateLanguageInput, { nullable: true })
  updateLanguage: UpdateLanguageInput;

  @Field((type) => DeleteLanguageInput, { nullable: true })
  deleteLanguage: DeleteLanguageInput;

  @Field((type) => CreatePropertyInput, { nullable: true })
  createProperty: CreatePropertyInput;

  @Field((type) => UpdatePropertyInput, { nullable: true })
  updateProperty: UpdatePropertyInput;

  @Field((type) => ReorderPropertiesInput, { nullable: true })
  reorderProperties: ReorderPropertiesInput;

  @Field((type) => DeletePropertyInput, { nullable: true })
  deleteProperty: DeletePropertyInput;

  @Field((type) => CreateWordInput, { nullable: true })
  createWord: CreateWordInput;

  @Field((type) => UpdateWordInput, { nullable: true })
  updateWord: UpdateWordInput;

  @Field((type) => DeleteWordInput, { nullable: true })
  deleteWord: DeleteWordInput;
}
