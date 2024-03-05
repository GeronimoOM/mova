import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('changes', (table) => {
    table.string('id').notNullable();
    table.timestamp('changed_at').notNullable().defaultTo(knex.fn.now());
    table.string('type').notNullable();
    table.string('client_id');
    table.json('data');

    table.primary(['changed_at', 'id']);
    table.index(['id', 'changed_at']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('changes');
}
