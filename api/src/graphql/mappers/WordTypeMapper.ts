import { Injectable } from '@nestjs/common';
import { Word, WordCreate, WordUpdate } from 'models/Word';
import {
  isOptionPropertyValue,
  isTextPropertyValue,
  PropertyValue,
} from 'models/PropertyValue';
import {
  CreateWordInput,
  UpdatePropertyValueInput,
  UpdateWordInput,
  WordType,
} from '../types/WordType';
import { PropertyTypeMapper } from './PropertyTypeMapper';
import {
  OptionPropertyValueType,
  PropertyValueUnionType,
  TextPropertyValueType,
} from '../types/PropertyValueType';
import { WordCreateType, WordUpdateType } from 'graphql/types/ChangeType';
import {
  CreateWordParams,
  UpdatePropertyValueParams,
  UpdateWordParams,
} from 'services/WordService';
import { PropertyId } from 'models/Property';

@Injectable()
export class WordTypeMapper {
  constructor(private propertyTypeMapper: PropertyTypeMapper) {}

  map(word: Word): WordType {
    return {
      id: word.id,
      original: word.original,
      translation: word.translation,
      partOfSpeech: word.partOfSpeech,
      addedAt: word.addedAt,
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
      languageId: wordCreate.languageId,
      properties: Object.values(wordCreate.properties ?? {}),
    };
  }

  mapUpdate(wordUpdate: WordUpdate): WordUpdateType {
    return {
      id: wordUpdate.id,
      original: wordUpdate.original,
      translation: wordUpdate.translation,
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
    } else if (isOptionPropertyValue(propertyValue)) {
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
