import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('properties', (table) => {
    table.integer('order').notNullable().after('part_of_speech');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('properties', (table) => {
    table.dropColumn('order');
  });
}
