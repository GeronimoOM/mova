import { v1 as uuid } from 'uuid';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import {
  BaseProperty,
  isOptionProperty,
  OptionId,
  OptionProperty,
  Property,
  PropertyId,
  PropertyType,
  TextProperty,
} from 'models/Property';
import { PropertyRepository } from 'repositories/PropertyRepository';
import { LanguageService } from './LanguageService';
import { PartOfSpeech } from 'models/Word';
import * as arrays from 'utils/arrays';
import { DateTime } from 'luxon';

export interface CreateBasePropertyParams {
  id?: PropertyId;
  name: string;
  type: PropertyType;
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  addedAt?: DateTime;
}

export interface CreateTextPropertyParams extends CreateBasePropertyParams {
  type: PropertyType.Text;
}

export interface CreateOptionPropertyParams extends CreateBasePropertyParams {
  type: PropertyType.Option;
  options: string[];
}

export type CreatePropertyParams =
  | CreateTextPropertyParams
  | CreateOptionPropertyParams;

export interface UpdatePropertyParams {
  id: PropertyId;
  name?: string;
  options?: Map<OptionId, string>;
}

@Injectable()
export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
  ) {}

  async getByLanguageId(
    languageId: LanguageId,
    partOfSpeech?: PartOfSpeech,
  ): Promise<Property[]> {
    return await this.propertyRepository.getByLanguageId(
      languageId,
      partOfSpeech,
    );
  }

  async getById(id: PropertyId): Promise<Property> {
    const property = await this.propertyRepository.getById(id);
    if (!property) {
      throw new Error('Property does not exist');
    }
    return property;
  }

  async getByIds(ids: PropertyId[]): Promise<Property[]> {
    return await this.propertyRepository.getByIds(ids);
  }

  async create(params: CreatePropertyParams): Promise<Property> {
    await this.languageService.getById(params.languageId);

    const order =
      (await this.propertyRepository.getCount(
        params.languageId,
        params.partOfSpeech,
      )) + 1;

    const baseProperty: BaseProperty = {
      id: params.id ?? uuid(),
      name: params.name,
      type: params.type,
      languageId: params.languageId,
      partOfSpeech: params.partOfSpeech,
      addedAt: params.addedAt ?? DateTime.now(),
      order,
    };

    let property: Property;
    switch (baseProperty.type) {
      case PropertyType.Text:
        property = baseProperty as TextProperty;
        break;
      case PropertyType.Option:
        const options = (params as CreateOptionPropertyParams).options;
        if (!options || options.length < 2) {
          throw new Error('Options are required');
        }
        property = {
          ...baseProperty,
          options: new Map(options.map((option) => [uuid(), option])),
        } as OptionProperty;
        break;
    }

    await this.propertyRepository.create(property);
    return property;
  }

  async update(params: UpdatePropertyParams): Promise<Property> {
    const property = await this.propertyRepository.getById(params.id);
    if (!property) {
      throw new Error('Property does not exist');
    }

    if (params.name) {
      property.name = params.name;
    }

    if (isOptionProperty(property)) {
      if (params.options) {
        for (const [optionId, optionValue] of params.options) {
          if (!property.options.has(optionId)) {
            throw new Error('Option does not exist');
          }
          property.options.set(optionId, optionValue);
        }
      }
    }

    await this.propertyRepository.update(property);
    return property;
  }

  async reorder(
    languageId: LanguageId,
    partOfSpeech: PartOfSpeech,
    orderedIds: PropertyId[],
  ): Promise<void> {
    await this.languageService.getById(languageId);

    const properties = await this.propertyRepository.getByLanguageId(
      languageId,
      partOfSpeech,
    );
    const currentOrderedIds = properties.map((property) => property.id);
    if (arrays.diff(orderedIds, currentOrderedIds).length) {
      throw new Error('Reordered properties are not same as current');
    }

    await this.propertyRepository.updateOrder(orderedIds);
  }

  async delete(id: PropertyId): Promise<Property> {
    const property = await this.propertyRepository.getById(id);

    await this.propertyRepository.delete(id);
    return property;
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.propertyRepository.deleteForLanguage(languageId);
  }
}
