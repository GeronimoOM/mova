import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  ChangeType,
  CreateLanguageChange,
  CreatePropertyChange,
  CreateWordChange,
  DeleteLanguageChange,
  DeletePropertyChange,
  DeleteWordChange,
  ReorderPropertiesChange,
  UpdateLanguageChange,
  UpdatePropertyChange,
  UpdateWordChange,
} from 'models/Change';
import { Language, LanguageId } from 'models/Language';
import {
  OptionProperty,
  Property,
  PropertyId,
  isOptionProperty,
} from 'models/Property';
import {
  BasePropertyValueSave,
  OptionPropertyValueSave,
  PropertyValue,
  PropertyValueSave,
  TextPropertyValueSave,
  isOptionPropertyValue,
  isTextPropertyValue,
} from 'models/PropertyValue';
import { PartOfSpeech, Word } from 'models/Word';
import * as records from 'utils/records';

@Injectable()
export class ChangeBuilder {
  buildCreateLanguageChange(language: Language): CreateLanguageChange {
    return {
      id: language.id,
      type: ChangeType.CreateLanguage,
      changedAt: language.addedAt,
      created: language,
    };
  }

  buildUpdateLanguageChange(
    language: Language,
    currentLanguage: Language,
  ): UpdateLanguageChange | null {
    if (language.name === currentLanguage.name) {
      return null;
    }

    return {
      id: language.id,
      type: ChangeType.UpdateLanguage,
      changedAt: DateTime.utc(),
      updated: {
        id: language.id,
        name: language.name,
      },
    };
  }

  buildDeleteLanguageChange(language: Language): DeleteLanguageChange {
    return {
      id: language.id,
      type: ChangeType.DeleteLanguage,
      changedAt: DateTime.utc(),
      deleted: language.id,
    };
  }

  buildCreatePropertyChange(property: Property): CreatePropertyChange {
    return {
      id: property.id,
      type: ChangeType.CreateProperty,
      changedAt: property.addedAt,
      created: property,
    };
  }

  buildUpdatePropertyChange(
    property: Property,
    currentProperty: Property,
  ): UpdatePropertyChange | null {
    const isOptionsChange =
      isOptionProperty(property) &&
      records.diff(
        property.options,
        (currentProperty as OptionProperty).options,
      );

    if (property.name === currentProperty.name && !isOptionsChange) {
      return null;
    }

    return {
      id: property.id,
      type: ChangeType.UpdateProperty,
      changedAt: DateTime.utc(),
      updated: {
        id: property.id,
        type: property.type,
        ...(property.name !== currentProperty.name && { name: property.name }),
        ...(isOptionsChange && { options: property.options }),
      },
    };
  }

  buildReorderPropertiesChange(
    languageId: LanguageId,
    partOfSpeech: PartOfSpeech,
    propertyIds: PropertyId[],
    currentPropertIds: PropertyId[],
  ): ReorderPropertiesChange | null {
    if (
      propertyIds.every(
        (propertyId, idx) => propertyId === currentPropertIds[idx],
      )
    ) {
      return null;
    }

    return {
      id: languageId,
      type: ChangeType.ReorderProperties,
      changedAt: DateTime.utc(),
      reordered: {
        languageId,
        partOfSpeech,
        propertyIds,
      },
    };
  }

  buildDeletePropertyChange(property: Property): DeletePropertyChange {
    return {
      id: property.id,
      type: ChangeType.DeleteProperty,
      changedAt: DateTime.utc(),
      deleted: property.id,
    };
  }

  buildCreateWordChange(word: Word): CreateWordChange {
    return {
      id: word.id,
      type: ChangeType.CreateWord,
      changedAt: word.addedAt,
      created: {
        ...word,
        ...(word.properties && {
          properties: records.mapValues(word.properties, (propertyValue) =>
            this.toPropertValueSave(propertyValue),
          ),
        }),
      },
    };
  }

  buildUpdateWordChange(
    word: Word,
    currentWord: Word,
  ): UpdateWordChange | null {
    const propertiesDiff = records.diff(
      word.properties,
      currentWord.properties,
      (pv1, pv2) => {
        if (
          isTextPropertyValue(pv1) &&
          isTextPropertyValue(pv2) &&
          pv1.text === pv2.text
        ) {
          return true;
        } else if (
          isOptionPropertyValue(pv1) &&
          isOptionPropertyValue(pv2) &&
          pv1.option === pv2.option
        ) {
          return true;
        }
        return false;
      },
    );
    if (
      word.original === currentWord.original &&
      word.translation === currentWord.translation &&
      !propertiesDiff
    ) {
      return null;
    }

    return {
      id: word.id,
      type: ChangeType.UpdateWord,
      changedAt: DateTime.utc(),
      updated: {
        id: word.id,
        ...(word.original !== currentWord.original && {
          original: word.original,
        }),
        ...(word.translation !== currentWord.translation && {
          translation: word.translation,
        }),
        ...(propertiesDiff && {
          properties: {
            ...records.mapValues(propertiesDiff.added, (propertyValue) =>
              this.toPropertValueSave(propertyValue),
            ),
            ...records.mapValues(propertiesDiff.updated, (propertyValue) =>
              this.toPropertValueSave(propertyValue),
            ),
            ...records.mapValues(propertiesDiff.deleted, (propertyValue) =>
              this.toPropertValueSave(propertyValue, true),
            ),
          },
        }),
      },
    };
  }

  buildDeleteWordChange(word: Word): DeleteWordChange {
    return {
      id: word.id,
      type: ChangeType.DeleteWord,
      changedAt: DateTime.utc(),
      deleted: word.id,
    };
  }

  private toPropertValueSave(
    propertyValue: PropertyValue,
    isDelete?: boolean,
  ): PropertyValueSave {
    const basePropertyValueSave: BasePropertyValueSave = {
      propertyId: propertyValue.property.id,
      type: propertyValue.property.type,
    };

    if (isTextPropertyValue(propertyValue)) {
      return {
        ...basePropertyValueSave,
        text: isDelete ? null : propertyValue.text,
      } as TextPropertyValueSave;
    } else {
      return {
        ...basePropertyValueSave,
        option: isDelete ? null : propertyValue.option,
      } as OptionPropertyValueSave;
    }
  }
}
