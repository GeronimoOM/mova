import { Injectable } from '@nestjs/common';
import { WordCreateType, WordUpdateType } from 'graphql/types/ChangeType';
import { PropertyId } from 'models/Property';
import { PropertyValue, isTextPropertyValue } from 'models/PropertyValue';
import { Word, WordCreate, WordUpdate } from 'models/Word';
import { ExerciseService } from 'services/ExerciseService';
import {
  CreateWordParams,
  UpdatePropertyValueParams,
  UpdateWordParams,
} from 'services/WordService';
import {
  OptionPropertyValueType,
  PropertyValueUnionType,
  TextPropertyValueType,
} from '../types/PropertyValueType';
import {
  CreateWordInput,
  UpdatePropertyValueInput,
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
      nextExerciseAt: this.exerciseService.getNextExerciseAt(wordCreate),
      languageId: wordCreate.languageId,
      properties: Object.values(wordCreate.properties ?? {}),
    };
  }

  mapUpdate(wordUpdate: WordUpdate): WordUpdateType {
    return {
      id: wordUpdate.id,
      original: wordUpdate.original,
      translation: wordUpdate.translation,
      mastery: wordUpdate.mastery,
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
      return {
        property,
        text: propertyValue.text,
      } as TextPropertyValueType;
    } else {
      const optionValue = propertyValue.property.options[propertyValue.option];
      return {
        property,
        option: {
          id: propertyValue.option,
          value: optionValue,
        },
      } as OptionPropertyValueType;
    }
  }

  private mapFromUpdateValuesInput(
    input?: UpdatePropertyValueInput[],
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
    input: UpdatePropertyValueInput,
  ): UpdatePropertyValueParams {
    return {
      ...(input.text && { text: input.text }),
      ...(input.option && { option: input.option }),
    };
  }
}
