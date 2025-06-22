import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('word_links', (table) => {
    table
      .uuid('word1_id')
      .notNullable()
      .references('id')
      .inTable('words')
      .onDelete('cascade');
    table
      .uuid('word2_id')
      .notNullable()
      .references('id')
      .inTable('words')
      .onDelete('cascade');
    table.string('type').notNullable();
    table.uuid('language_id').notNullable();
    table.primary(['word1_id', 'word2_id', 'type']);
    table.unique(['word2_id', 'word1_id', 'type']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('word_links');
}
