import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('topics', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table
      .uuid('language_id')
      .notNullable()
      .references('id')
      .inTable('languages');
    table.timestamp('added_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('topics_words', (table) => {
    table
      .uuid('topic_id')
      .notNullable()
      .references('id')
      .inTable('topics')
      .onDelete('cascade');
    table
      .uuid('word_id')
      .notNullable()
      .references('id')
      .inTable('words')
      .onDelete('cascade');
    table.primary(['topic_id', 'word_id']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('topics_words');
  await knex.schema.dropTableIfExists('topics');
}
