import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.integer('mastery').after('part_of_speech').notNullable().defaultTo(0);
    table.timestamp('mastery_inc_at').after('mastery');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.dropColumn('mastery_inc_at');
    table.dropColumn('mastery');
  });
}
