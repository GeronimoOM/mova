import { Injectable } from '@nestjs/common';
import { PropertyTable } from 'knex/types/tables';
import { DateTime } from 'luxon';
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
import { PartOfSpeech } from 'models/Word';
import { DATETIME_FORMAT } from 'utils/constants';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_PROPERTIES = 'properties';

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

  async getAll(): Promise<Property[]> {
    const propertyRows = await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .orderBy('added_at', 'asc');

    return propertyRows.map((propertyRow) => this.mapToProperty(propertyRow));
  }

  async getCount(
    languageId: LanguageId,
    partOfSpeech: PartOfSpeech,
  ): Promise<number> {
    const [{ count }] = (await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ language_id: languageId, part_of_speech: partOfSpeech })
      .count('id as count')) as [{ count: string }];

    return Number(count);
  }

  async create(property: Property): Promise<void> {
    const propertyRow: Partial<PropertyTable> = {
      id: property.id,
      name: property.name,
      type: property.type,
      language_id: property.languageId,
      part_of_speech: property.partOfSpeech,
      added_at: property.addedAt.toFormat(DATETIME_FORMAT),
      order: property.order,
    };

    if (isOptionProperty(property)) {
      propertyRow.data = this.serializer.serialize({
        options: property.options,
      });
    }

    await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .insert(propertyRow);
  }

  async update(property: Property): Promise<void> {
    const propertyRow: Partial<PropertyTable> = {
      name: property.name,
    };

    if (isOptionProperty(property)) {
      propertyRow.data = this.serializer.serialize({
        options: property.options,
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
      addedAt: DateTime.fromFormat(row.added_at, DATETIME_FORMAT),
      order: row.order,
    };

    switch (row.type) {
      case PropertyType.Text:
        return baseProperty as TextProperty;
      case PropertyType.Option:
        const options: Record<OptionId, string> =
          this.serializer.deserialize<OptionProperty>(row.data).options;
        return {
          ...baseProperty,
          options,
        } as OptionProperty;
    }
  }
}
