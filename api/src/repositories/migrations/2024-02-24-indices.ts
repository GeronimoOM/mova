import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.index('added_at', 'languages_added_at');
  });

  await knex.schema.alterTable('properties', (table) => {
    table.index(
      ['language_id', 'part_of_speech'],
      'properties_language_id_part_of_speech',
    );
  });

  await knex.schema.alterTable('words', (table) => {
    table.index(['language_id', 'added_at'], 'words_language_id_added_at');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.dropIndex('languages_added_at');
  });

  await knex.schema.alterTable('properties', (table) => {
    table.dropIndex('properties_language_id_part_of_speech');
  });

  await knex.schema.alterTable('words', (table) => {
    table.dropIndex('words_language_id_added_at');
  });
}
