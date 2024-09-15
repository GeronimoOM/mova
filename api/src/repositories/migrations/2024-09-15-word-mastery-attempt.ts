import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.timestamp('mastery_attempt_at').after('mastery_inc_at');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('words', (table) => {
    table.dropColumn('mastery_attempt_at');
  });
}
