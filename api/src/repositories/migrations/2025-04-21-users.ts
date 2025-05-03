import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.string('password').notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('users');
}
