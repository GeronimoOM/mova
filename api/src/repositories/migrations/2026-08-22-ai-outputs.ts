import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('ai_outputs', (table) => {
    table.string('key').notNullable().primary();
    table.string('type').notNullable();
    table.json('data').notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('ai_outputs');
}
