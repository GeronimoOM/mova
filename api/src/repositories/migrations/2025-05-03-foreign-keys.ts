import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('properties', (table) => {
    table.dropForeign('language_id');
  });

  await knex.schema.alterTable('words', (table) => {
    table.dropForeign('language_id');
  });

  await knex.schema.alterTable('progress', (table) => {
    table.dropForeign('language_id');
  });

  await knex.schema.alterTable('goals', (table) => {
    table.dropForeign('language_id');
  });
}

export async function down() {}
