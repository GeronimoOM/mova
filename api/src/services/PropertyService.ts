import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Color } from 'models/Color';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import {
  BaseProperty,
  isOptionProperty,
  Option,
  OptionId,
  OptionProperty,
  Property,
  PropertyId,
  PropertyType,
  TextProperty,
} from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { PropertyRepository } from 'repositories/PropertyRepository';
import { Serializer } from 'repositories/Serializer';
import * as arrays from 'utils/arrays';
import { v1 as uuid } from 'uuid';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';
import { LanguageService } from './LanguageService';
import { WordService } from './WordService';

const MAX_OPTIONS_LENGTH = 20;

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
  options: CreateOptionParams[];
}

export interface CreateOptionParams {
  id?: OptionId;
  value: string;
  color?: Color;
}

export type CreatePropertyParams =
  | CreateTextPropertyParams
  | CreateOptionPropertyParams;

export interface UpdatePropertyParams {
  id: PropertyId;
  name?: string;
  options?: UpdateOptionParams[];
}

export interface UpdateOptionParams {
  id?: OptionId;
  value?: string;
  color?: Color;
}

export interface ReorderPropertiesParams {
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  propertyIds: PropertyId[];
}

export interface DeletePropertyParams {
  id: PropertyId;
}

@Injectable()
export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => WordService))
    private wordService: WordService,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getByLanguageId(
    ctx: Context,
    languageId: LanguageId,
    partOfSpeech?: PartOfSpeech,
  ): Promise<Property[]> {
    await this.languageService.getById(ctx, languageId);

    return await this.propertyRepository.getByLanguageId(
      languageId,
      partOfSpeech,
    );
  }

  async getById(ctx: Context, id: PropertyId): Promise<Property> {
    const property = await this.propertyRepository.getById(id);
    if (
      !property ||
      !(await this.languageService.exists(ctx, property.languageId))
    ) {
      throw new Error(`Property does not exist (id:${id})`);
    }
    return property;
  }

  async getByIds(ids: PropertyId[]): Promise<Property[]> {
    return await this.propertyRepository.getByIds(ids);
  }

  async getAll(ctx: Context): Promise<Property[]> {
    const languages = await this.languageService.getAll(ctx);

    return await this.propertyRepository.getAll(
      languages.map((language) => language.id),
    );
  }

  async create(ctx: Context, params: CreatePropertyParams): Promise<Property> {
    await this.languageService.getById(ctx, params.languageId);

    const order = await this.propertyRepository.getCount(
      params.languageId,
      params.partOfSpeech,
    );

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
      case PropertyType.Option: {
        const inputOptions = (params as CreateOptionPropertyParams).options;
        if (inputOptions.length > MAX_OPTIONS_LENGTH) {
          throw new Error('Too many options');
        }

        const options: Record<OptionId, Option> = {};
        for (const { id, value, color } of inputOptions) {
          options[id ?? uuid()] = {
            value: value.trim(),
            color,
          };
        }

        property = {
          ...baseProperty,
          options,
        } as OptionProperty;
        break;
      }
    }

    await this.connectionManager.transactionally(async () => {
      await this.propertyRepository.create(property);
      await this.changeService.create(
        this.changeBuilder.buildCreatePropertyChange(ctx, property),
      );
    });

    return property;
  }

  async update(ctx: Context, params: UpdatePropertyParams): Promise<Property> {
    const property = await this.getById(ctx, params.id);
    const currentProperty = this.serializer.copy(property);

    if (params.name) {
      property.name = params.name.trim();
    }

    const deletedOptions: Record<OptionId, Option> = {};
    if (isOptionProperty(property) && params.options) {
      for (const { id, value, color } of params.options) {
        if (!id || !property.options[id]) {
          if (!value) {
            throw new Error('Option value cannot be empty');
          }

          property.options[id ?? uuid()] = {
            value: value.trim(),
            color: color,
          };
        } else if (!value) {
          deletedOptions[id] = property.options[id];
          delete property.options[id];
        } else {
          property.options[id] = {
            ...property.options[id],
            value: value.trim(),
            ...(color !== undefined && { color }),
          };
        }
      }

      if (Object.values(property.options).length > MAX_OPTIONS_LENGTH) {
        throw new Error('Too many options');
      }
    }

    const change = this.changeBuilder.buildUpdatePropertyChange(
      ctx,
      property,
      currentProperty,
    );

    if (change) {
      await this.connectionManager.transactionally(async () => {
        await this.propertyRepository.update(property);
        await this.detachDeletedOptions(property, deletedOptions);
        await this.changeService.create(change);
      });
    }

    return property;
  }

  private async detachDeletedOptions(
    property: Property,
    deletedOptions: Record<OptionId, Option>,
  ) {
    for (const [deletedOptionId, deletedOption] of Object.entries(
      deletedOptions,
    )) {
      await this.wordService.detachOption(
        property.languageId,
        property.id,
        property.partOfSpeech,
        deletedOptionId,
        deletedOption,
      );
    }
  }

  async reorder(
    ctx: Context,
    { languageId, partOfSpeech, propertyIds }: ReorderPropertiesParams,
  ): Promise<void> {
    await this.languageService.getById(ctx, languageId);

    const properties = await this.propertyRepository.getByLanguageId(
      languageId,
      partOfSpeech,
    );
    const currentOrderedIds = properties.map((property) => property.id);
    if (arrays.diffItems(propertyIds, currentOrderedIds).length) {
      throw new Error('Reordered properties are not same as current');
    }

    const change = this.changeBuilder.buildReorderPropertiesChange(
      ctx,
      languageId,
      partOfSpeech,
      propertyIds,
      currentOrderedIds,
    );

    if (change) {
      await this.connectionManager.transactionally(async () => {
        await this.propertyRepository.updateOrder(propertyIds);
        await this.changeService.create(change);
      });
    }
  }

  async delete(ctx: Context, { id }: DeletePropertyParams): Promise<Property> {
    const property = await this.getById(ctx, id);

    await this.connectionManager.transactionally(async () => {
      await this.propertyRepository.delete(id);
      await this.changeService.create(
        this.changeBuilder.buildDeletePropertyChange(ctx, property),
      );
    });

    return property;
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.propertyRepository.deleteForLanguage(languageId);
  }
}
