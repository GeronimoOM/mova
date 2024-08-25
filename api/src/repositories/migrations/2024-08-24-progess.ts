import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('progress', (table) => {
    table.timestamp('date').notNullable();
    table.string('type').notNullable();
    table.integer('points').notNullable().defaultTo(0);
    table
      .uuid('language_id')
      .notNullable()
      .references('id')
      .inTable('languages');
    table.primary(['language_id', 'type', 'date']);
  });

  await knex.schema.createTable('goals', (table) => {
    table.string('type').notNullable();
    table.string('cadence').notNullable();
    table.integer('points').notNullable();
    table
      .uuid('language_id')
      .notNullable()
      .references('id')
      .inTable('languages');
    table.primary(['language_id', 'type']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('goals');
  await knex.schema.dropTableIfExists('progress');
}
