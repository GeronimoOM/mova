import { Injectable } from '@nestjs/common';
import { PropertyTable } from 'knex/types/tables';
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
import { DbConnectionManager } from './DbConnectionManager';
import { PartOfSpeech } from 'models/Word';

const TABLE_PROPERTIES = 'properties';

@Injectable()
export class PropertyRepository {
  constructor(private connectionManager: DbConnectionManager) {}

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

  async getCount(
    languageId: LanguageId,
    partOfSpeech: PartOfSpeech,
  ): Promise<number> {
    const { count } = (await this.connectionManager
      .getConnection()(TABLE_PROPERTIES)
      .where({ language_id: languageId, part_of_speech: partOfSpeech })
      .count('id as count')
      .first()!) as any;

    return Number(count);
  }

  async create(property: Property): Promise<void> {
    const propertyRow: Partial<PropertyTable> = {
      id: property.id,
      name: property.name,
      type: property.type,
      language_id: property.languageId,
      part_of_speech: property.partOfSpeech,
      order: property.order,
    };

    if (isOptionProperty(property)) {
      propertyRow.data = JSON.stringify({
        options: Object.fromEntries(property.options),
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
      propertyRow.data = JSON.stringify({
        options: Object.fromEntries(property.options),
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
      order: row.order,
    };

    switch (row.type) {
      case PropertyType.Text:
        return baseProperty as TextProperty;
      case PropertyType.Option:
        const options: Record<OptionId, string> = JSON.parse(row.data).options;
        return {
          ...baseProperty,
          options: new Map(Object.entries(options)),
        } as OptionProperty;
    }
  }
}
