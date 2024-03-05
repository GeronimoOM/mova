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
import { ChangeService } from './ChangeService';
import { ChangeBuilder } from './ChangeBuilder';
import { copy } from 'utils/copy';

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
  options?: Record<OptionId, string>;
}

export interface ReorderPropertiesParams {
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  propertyIds: PropertyId[];
}

@Injectable()
export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private changeBuilder: ChangeBuilder,
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

  async getAll(): Promise<Property[]> {
    return await this.propertyRepository.getAll();
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
      addedAt: params.addedAt ?? DateTime.utc(),
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
          options: Object.fromEntries(
            options.map((option) => [uuid(), option]),
          ),
        } as OptionProperty;
        break;
    }

    await this.propertyRepository.create(property);
    await this.changeService.create(
      this.changeBuilder.buildCreatePropertyChange(property),
    );
    return property;
  }

  async update(params: UpdatePropertyParams): Promise<Property> {
    const property = await this.getById(params.id);
    const currentProperty = copy(property);

    if (params.name) {
      property.name = params.name.trim();
    }

    if (isOptionProperty(property)) {
      if (params.options) {
        for (const [optionId, optionValue] of Object.entries(params.options)) {
          if (!property.options[optionId]) {
            throw new Error('Option does not exist');
          } else if (!optionValue) {
            delete property[optionId];
          } else {
            property.options[optionId] = optionValue;
          }
        }
      }
    }

    const change = this.changeBuilder.buildUpdatePropertyChange(
      property,
      currentProperty,
    );
    if (change) {
      await this.propertyRepository.update(property);
      await this.changeService.create(change);
    }

    return property;
  }

  async reorder({
    languageId,
    partOfSpeech,
    propertyIds,
  }: ReorderPropertiesParams): Promise<void> {
    await this.languageService.getById(languageId);

    const properties = await this.propertyRepository.getByLanguageId(
      languageId,
      partOfSpeech,
    );
    const currentOrderedIds = properties.map((property) => property.id);
    if (arrays.diffItems(propertyIds, currentOrderedIds).length) {
      throw new Error('Reordered properties are not same as current');
    }

    const change = this.changeBuilder.buildReorderPropertiesChange(
      languageId,
      partOfSpeech,
      propertyIds,
      currentOrderedIds,
    );

    if (change) {
      await this.propertyRepository.updateOrder(propertyIds);
      await this.changeService.create(change);
    }
  }

  async delete(id: PropertyId): Promise<Property> {
    const property = await this.propertyRepository.getById(id);

    await this.propertyRepository.delete(id);
    await this.changeService.create(
      this.changeBuilder.buildDeletePropertyChange(property),
    );
    return property;
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.propertyRepository.deleteForLanguage(languageId);
  }
}
