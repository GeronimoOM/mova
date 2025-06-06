import { Injectable } from '@nestjs/common';
import { PropertyTable } from 'knex/types/tables';
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
import { fromTimestamp, toTimestamp } from 'utils/datetime';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_PROPERTIES = 'properties';

type DbOption = Option & {
  id: OptionId;
};

@Injectable()
export class PropertyRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getByLanguageId(
    languageId: LanguageId,
    partOfSpeech?: PartOfSpeech,
  ): Promise<Property[]> {
    const propertyRows = await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({
        language_id: languageId,
        ...(partOfSpeech && { part_of_speech: partOfSpeech }),
      })
      .orderBy('order', 'asc');

    return propertyRows.map((propertyRow) => this.mapToProperty(propertyRow));
  }

  async getById(id: PropertyId): Promise<Property | null> {
    const propertyRow = await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ id })
      .first();

    return propertyRow ? this.mapToProperty(propertyRow) : null;
  }

  async getByIds(ids: PropertyId[]): Promise<Property[]> {
    const propertyRows = await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .whereIn('id', ids);

    return propertyRows.map((propertyRow) => this.mapToProperty(propertyRow));
  }

  async getAll(languageIds: LanguageId[]): Promise<Property[]> {
    const propertyRows = await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .whereIn('language_id', languageIds)
      .orderBy('added_at', 'asc');

    return propertyRows.map((propertyRow) => this.mapToProperty(propertyRow));
  }

  async getMaxOrder(
    languageId: LanguageId,
    partOfSpeech: PartOfSpeech,
  ): Promise<number> {
    const [{ max_order: maxOrder }] = (await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ language_id: languageId, part_of_speech: partOfSpeech })
      .max('order as max_order')) as [{ max_order: number | null }];

    return maxOrder ?? 0;
  }

  async create(property: Property): Promise<void> {
    const propertyRow: Partial<PropertyTable> = {
      id: property.id,
      name: property.name,
      type: property.type,
      language_id: property.languageId,
      part_of_speech: property.partOfSpeech,
      added_at: toTimestamp(property.addedAt),
      order: property.order,
    };

    if (isOptionProperty(property)) {
      propertyRow.data = this.serializer.serialize<{
        options: DbOption[];
      }>({
        options: Object.entries(property.options).map(
          ([optionId, optionValue]) => ({
            id: optionId,
            ...optionValue,
          }),
        ),
      });
    }

    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .insert(propertyRow)
      .onConflict()
      .ignore();
  }

  async update(property: Property): Promise<void> {
    const propertyRow: Partial<PropertyTable> = {
      name: property.name,
    };

    if (isOptionProperty(property)) {
      propertyRow.data = this.serializer.serialize<{
        options: DbOption[];
      }>({
        options: Object.entries(property.options).map(
          ([optionId, optionValue]) => ({
            id: optionId,
            ...optionValue,
          }),
        ),
      });
    }

    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .update(propertyRow)
      .where({ id: property.id });
  }

  async updateOrder(propertyIds: PropertyId[]): Promise<void> {
    await this.connectionManager.getConnection().transaction(async (trx) => {
      await Promise.all(
        propertyIds.map((propertyId, i) =>
          trx(TABLE_PROPERTIES)
            .update({ order: i + 1 })
            .where({ id: propertyId }),
        ),
      );
    });
  }

  async delete(id: PropertyId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ id })
      .delete();
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ language_id: languageId })
      .delete();
  }

  streamRecords(): AsyncIterable<PropertyTable> {
    return this.connectionManager.getConnection()(TABLE_PROPERTIES).stream();
  }

  async insertBatch(batch: PropertyTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_PROPERTIES).delete();
  }

  private mapToProperty(row: PropertyTable): Property {
    const baseProperty: BaseProperty = {
      id: row.id,
      name: row.name,
      type: row.type,
      languageId: row.language_id,
      partOfSpeech: row.part_of_speech,
      addedAt: fromTimestamp(row.added_at),
      order: row.order,
    };

    switch (row.type) {
      case PropertyType.Text:
        return baseProperty as TextProperty;
      case PropertyType.Option: {
        const options = row.data
          ? Object.fromEntries(
              this.serializer
                .deserialize<{
                  options: DbOption[];
                }>(row.data)
                .options.map(({ id, ...rest }) => [id, rest]),
            )
          : {};

        return {
          ...baseProperty,
          options,
        } as OptionProperty;
      }
    }
  }
}
