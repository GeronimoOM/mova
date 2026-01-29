import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  BaseChange,
  ChangeType,
  CreateLanguageChange,
  CreatePropertyChange,
  CreateWordChange,
  CreateWordLinkChange,
  DeleteLanguageChange,
  DeletePropertyChange,
  DeleteWordChange,
  DeleteWordLinkChange,
  ReorderPropertiesChange,
  UpdateLanguageChange,
  UpdatePropertyChange,
  UpdateWordChange,
} from 'models/Change';
import { Context } from 'models/Context';
import { Language, LanguageId } from 'models/Language';
import {
  Option,
  OptionId,
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
  arePropertyValuesOptionsEqual,
  isOptionPropertyValue,
  isTextPropertyValue,
} from 'models/PropertyValue';
import { PartOfSpeech, Word, WordLink } from 'models/Word';
import * as records from 'utils/records';
import { ExerciseService } from './ExerciseService';

@Injectable()
export class ChangeBuilder {
  constructor(
    @Inject(forwardRef(() => ExerciseService))
    private exerciseService: ExerciseService,
  ) {}

  buildCreateLanguageChange(
    ctx: Context,
    language: Language,
  ): CreateLanguageChange {
    return {
      ...this.buildBaseChange(ctx),
      id: language.id,
      type: ChangeType.CreateLanguage,
      changedAt: language.addedAt,
      created: language,
    };
  }

  buildUpdateLanguageChange(
    ctx: Context,
    language: Language,
    currentLanguage: Language,
  ): UpdateLanguageChange | null {
    if (language.name === currentLanguage.name) {
      return null;
    }

    return {
      ...this.buildBaseChange(ctx),
      id: language.id,
      type: ChangeType.UpdateLanguage,
      updated: {
        id: language.id,
        name: language.name,
      },
    };
  }

  buildDeleteLanguageChange(
    ctx: Context,
    language: Language,
  ): DeleteLanguageChange {
    return {
      ...this.buildBaseChange(ctx),
      id: language.id,
      type: ChangeType.DeleteLanguage,
      deleted: language.id,
    };
  }

  buildCreatePropertyChange(
    ctx: Context,
    property: Property,
  ): CreatePropertyChange {
    return {
      ...this.buildBaseChange(ctx),
      id: property.id,
      type: ChangeType.CreateProperty,
      changedAt: property.addedAt,
      created: property,
    };
  }

  buildUpdatePropertyChange(
    ctx: Context,
    property: Property,
    currentProperty: Property,
  ): UpdatePropertyChange | null {
    let optionsChange: Record<OptionId, Option | null> | null = null;
    if (isOptionProperty(property)) {
      const optionsDiff = records.diff(
        property.options,
        (currentProperty as OptionProperty).options,
        (opt1, opt2) => opt1.value === opt2.value && opt1.color === opt2.color,
      );

      if (optionsDiff) {
        optionsChange = {
          ...optionsDiff.added,
          ...optionsDiff.updated,
          ...records.mapValues(optionsDiff.deleted, () => null),
        };
      }
    }

    if (property.name === currentProperty.name && !optionsChange) {
      return null;
    }

    return {
      ...this.buildBaseChange(ctx),
      id: property.id,
      type: ChangeType.UpdateProperty,
      updated: {
        id: property.id,
        type: property.type,
        ...(property.name !== currentProperty.name && { name: property.name }),
        ...(optionsChange && { options: optionsChange }),
      },
    };
  }

  buildReorderPropertiesChange(
    ctx: Context,
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
      ...this.buildBaseChange(ctx),
      id: languageId,
      type: ChangeType.ReorderProperties,
      reordered: {
        languageId,
        partOfSpeech,
        propertyIds,
      },
    };
  }

  buildDeletePropertyChange(
    ctx: Context,
    property: Property,
  ): DeletePropertyChange {
    return {
      ...this.buildBaseChange(ctx),
      id: property.id,
      type: ChangeType.DeleteProperty,
      deleted: property.id,
    };
  }

  buildCreateWordChange(ctx: Context, word: Word): CreateWordChange {
    return {
      ...this.buildBaseChange(ctx),
      id: word.id,
      type: ChangeType.CreateWord,
      changedAt: word.addedAt,
      created: {
        ...word,
        properties: word.properties
          ? records.mapValues(word.properties, (propertyValue) =>
              this.toPropertyValueSave(propertyValue),
            )
          : undefined,
      },
    };
  }

  buildUpdateWordChange(
    ctx: Context,
    word: Word,
    currentWord: Word,
  ): UpdateWordChange | null {
    const propertiesDiff = records.diff(
      word.properties ?? null,
      currentWord.properties ?? null,
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
          arePropertyValuesOptionsEqual(pv1.option, pv2.option)
        ) {
          return true;
        }
        return false;
      },
    );
    const nextExerciseAt = this.exerciseService.getNextExerciseAt(word);
    const currentNextExerciseAt =
      this.exerciseService.getNextExerciseAt(currentWord);

    if (
      word.original === currentWord.original &&
      word.translation === currentWord.translation &&
      !propertiesDiff &&
      word.mastery === currentWord.mastery &&
      word.confidence === currentWord.confidence &&
      nextExerciseAt === currentNextExerciseAt
    ) {
      return null;
    }

    return {
      ...this.buildBaseChange(ctx),
      id: word.id,
      type: ChangeType.UpdateWord,
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
              this.toPropertyValueSave(propertyValue),
            ),
            ...records.mapValues(propertiesDiff.updated, (propertyValue) =>
              this.toPropertyValueSave(propertyValue),
            ),
            ...records.mapValues(propertiesDiff.deleted, (propertyValue) =>
              this.toPropertyValueSave(propertyValue, true),
            ),
          },
        }),
        ...(word.mastery !== currentWord.mastery && {
          mastery: word.mastery,
        }),
        ...(word.confidence !== currentWord.confidence && {
          confidence: word.confidence,
        }),
        ...(nextExerciseAt !== currentNextExerciseAt && {
          nextExerciseAt,
        }),
      },
    };
  }

  buildDeleteWordChange(ctx: Context, word: Word): DeleteWordChange {
    return {
      ...this.buildBaseChange(ctx),
      id: word.id,
      type: ChangeType.DeleteWord,
      deleted: word.id,
    };
  }

  buildCreateWordLinkChange(
    ctx: Context,
    wordLink: WordLink,
  ): CreateWordLinkChange {
    return {
      ...this.buildBaseChange(ctx),
      id: wordLink.word1Id,
      type: ChangeType.CreateWordLink,
      created: wordLink,
    };
  }

  buildDeleteWordLinkChange(
    ctx: Context,
    wordLink: WordLink,
  ): DeleteWordLinkChange {
    return {
      ...this.buildBaseChange(ctx),
      id: wordLink.word1Id,
      type: ChangeType.DeleteWordLink,
      deleted: wordLink,
    };
  }

  private buildBaseChange(
    ctx: Context,
  ): Pick<BaseChange, 'userId' | 'clientId' | 'changedAt'> {
    return {
      userId: ctx.user.id,
      clientId: ctx.clientId,
      changedAt: DateTime.utc(),
    };
  }

  private toPropertyValueSave(
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
