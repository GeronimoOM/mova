import { Injectable } from '@nestjs/common';
import {
  PropertyValueSaveUnionType,
  WordCreateType,
  WordUpdateType,
} from 'graphql/types/ChangeType';
import {
  OptionPropertyType,
  TextPropertyType,
} from 'graphql/types/PropertyType';
import { PropertyId, PropertyType } from 'models/Property';
import {
  PropertyValue,
  PropertyValueSave,
  isIdOptionValue,
  isTextPropertyValue,
} from 'models/PropertyValue';
import { Word, WordCreate, WordUpdate } from 'models/Word';
import { ExerciseService } from 'services/ExerciseService';
import {
  CreateWordParams,
  UpdatePropertyValueParams,
  UpdateWordParams,
} from 'services/WordService';
import {
  OptionValueType,
  PropertyValueUnionType,
} from '../types/PropertyValueType';
import {
  CreateWordInput,
  SavePropertyValueInput,
  UpdateWordInput,
  WordType,
} from '../types/WordType';
import { PropertyTypeMapper } from './PropertyTypeMapper';

@Injectable()
export class WordTypeMapper {
  constructor(
    private exerciseService: ExerciseService,
    private propertyTypeMapper: PropertyTypeMapper,
  ) {}

  map(word: Word): WordType {
    return {
      id: word.id,
      original: word.original,
      translation: word.translation,
      partOfSpeech: word.partOfSpeech,
      addedAt: word.addedAt,
      mastery: word.mastery,
      confidence: word.confidence,
      nextExerciseAt: this.exerciseService.getNextExerciseAt(word),
      languageId: word.languageId,
      properties: Object.values(word.properties ?? {}).map((value) =>
        this.mapPropertyValue(value),
      ),
    };
  }

  mapCreate(wordCreate: WordCreate): WordCreateType {
    return {
      id: wordCreate.id,
      original: wordCreate.original,
      translation: wordCreate.translation,
      partOfSpeech: wordCreate.partOfSpeech,
      addedAt: wordCreate.addedAt,
      mastery: wordCreate.mastery,
      confidence: wordCreate.confidence,
      nextExerciseAt: this.exerciseService.getNextExerciseAt(wordCreate),
      languageId: wordCreate.languageId,
      properties: Object.values(wordCreate.properties ?? {}).map(
        (propertyValue) => this.mapPropertyValueSave(propertyValue),
      ),
    };
  }

  mapUpdate(wordUpdate: WordUpdate): WordUpdateType {
    return {
      id: wordUpdate.id,
      original: wordUpdate.original,
      translation: wordUpdate.translation,
      mastery: wordUpdate.mastery,
      confidence: wordUpdate.confidence,
      nextExerciseAt: wordUpdate.nextExerciseAt,
      ...(wordUpdate.properties && {
        properties: Object.values(wordUpdate.properties),
      }),
    };
  }

  mapFromCreateInput(input: CreateWordInput): CreateWordParams {
    return {
      ...input,
      properties: this.mapFromUpdateValuesInput(input.properties),
    };
  }

  mapFromUpdateInput(input: UpdateWordInput): UpdateWordParams {
    return {
      ...input,
      properties: this.mapFromUpdateValuesInput(input.properties),
    };
  }

  private mapPropertyValue(
    propertyValue: PropertyValue,
  ): typeof PropertyValueUnionType {
    const property = this.propertyTypeMapper.map(propertyValue.property);
    if (isTextPropertyValue(propertyValue)) {
      const textProperty = property as TextPropertyType;

      return {
        property: textProperty,
        text: propertyValue.text,
      };
    } else {
      const optionProperty = property as OptionPropertyType;

      let option: OptionValueType;
      if (isIdOptionValue(propertyValue.option)) {
        const propertyOption =
          propertyValue.property.options[propertyValue.option.id];
        option = {
          id: propertyValue.option.id,
          ...propertyOption,
        };
      } else {
        option = propertyValue.option;
      }

      return {
        property: optionProperty,
        option,
      };
    }
  }

  private mapFromUpdateValuesInput(
    input?: SavePropertyValueInput[],
  ): Record<PropertyId, UpdatePropertyValueParams> | undefined {
    if (!input) {
      return;
    }
    return Object.fromEntries(
      input.map((propertyInput) => [
        propertyInput.id,
        this.mapFromUpdateValueInput(propertyInput),
      ]),
    );
  }

  private mapFromUpdateValueInput(
    input: SavePropertyValueInput,
  ): UpdatePropertyValueParams {
    return {
      ...(input.text && { text: input.text }),
      ...(input.option && { option: input.option }),
    };
  }

  private mapPropertyValueSave(
    propertyValueSave: PropertyValueSave,
  ): typeof PropertyValueSaveUnionType {
    if (propertyValueSave.type === PropertyType.Text) {
      return {
        propertyId: propertyValueSave.propertyId,
        type: propertyValueSave.type,
        text: propertyValueSave.text ?? undefined,
      };
    } else {
      return {
        propertyId: propertyValueSave.propertyId,
        type: propertyValueSave.type,
        ...(propertyValueSave.option &&
          (isIdOptionValue(propertyValueSave.option)
            ? {
                optionId: propertyValueSave.option.id,
              }
            : {
                value: propertyValueSave.option.value,
                color: propertyValueSave.option.color,
              })),
      };
    }
  }
}
