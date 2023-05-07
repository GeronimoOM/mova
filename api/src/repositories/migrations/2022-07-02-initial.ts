import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('languages', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('properties', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.string('type').notNullable();
    table
      .uuid('language_id').notNullable()
      .references('id')
      .inTable('languages');
    table.string('part_of_speech').notNullable();
    table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());
    table.json('data');
  });

  await knex.schema.createTable('words', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('original').notNullable();
    table.string('translation').notNullable();
    table
      .uuid('language_id')
      .notNullable()
      .references('id')
      .inTable('languages');
    table.string('part_of_speech').notNullable();
    table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());
    table.json('properties');
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('words');
  await knex.schema.dropTableIfExists('properties');
  await knex.schema.dropTableIfExists('languages');
}
