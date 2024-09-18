import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('user_settings', (table) => {
    table.uuid('user_id').notNullable().primary();
    table.json('settings');
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('user_settings');
}
