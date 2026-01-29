import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.integer('confidence').after('mastery').notNullable().defaultTo(0);
    table.dropColumn('mastery_inc_at');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.dropColumn('confidence');
    table.timestamp('mastery_inc_at').after('mastery');
  });
}
