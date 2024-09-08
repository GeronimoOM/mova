import { Knex } from 'knex';

const defaultUserId = '00000000-0000-0000-0000-000000000000';

export async function up(knex: Knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.uuid('user_id').notNullable().defaultTo(defaultUserId);
    table.index('user_id');
  });

  await knex.schema.alterTable('changes', (table) => {
    table.uuid('user_id').notNullable().defaultTo(defaultUserId);
    table.index('user_id');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('languages', (table) => {
    table.dropColumn('user_id');
  });

  await knex.schema.alterTable('changes', (table) => {
    table.dropColumn('user_id');
  });
}
