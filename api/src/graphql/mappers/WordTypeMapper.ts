import { Injectable } from '@nestjs/common';
import { Word } from 'models/Word';
import {
  isOptionPropertyValue,
  isTextPropertyValue,
  PropertyValue,
} from 'models/PropertyValue';
import { WordType } from '../types/WordType';
import { PropertyTypeMapper } from './PropertyTypeMapper';
import {
  OptionPropertyValueType,
  PropertyValueUnionType,
  TextPropertyValueType,
} from '../types/PropertyValueType';

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
      properties: Array.from(word.properties?.values() ?? []).map((value) =>
        this.mapPropertyValue(value),
      ),
    };
  }

  mapPropertyValue(
    propertyValue: PropertyValue,
  ): typeof PropertyValueUnionType {
    const property = this.propertyTypeMapper.map(propertyValue.property);
    if (isTextPropertyValue(propertyValue)) {
      return {
        property,
        text: propertyValue.text,
      } as TextPropertyValueType;
    } else if (isOptionPropertyValue(propertyValue)) {
      const optionValue = propertyValue.property.options.get(
        propertyValue.option,
      )!;
      return {
        property,
        option: {
          id: propertyValue.option,
          value: optionValue,
        },
      } as OptionPropertyValueType;
    }
  }
}
