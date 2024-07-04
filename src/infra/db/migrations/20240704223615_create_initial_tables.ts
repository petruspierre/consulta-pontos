import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('partner', function (table) {
      table.increments('id').primary();
      table.text('name').notNullable();
    })
    .createTable('source', function (table) {
      table.increments('id').primary();
      table.text('name').notNullable();
      table.text('url').notNullable();
    })
    .createTable('partner_source', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.integer('partner_id').unsigned().notNullable();
      table.integer('source_id').unsigned().notNullable();
      table.jsonb('reference').notNullable();

      table.foreign('partner_id').references('id').inTable('partner');
      table.foreign('source_id').references('id').inTable('source');

      table.unique(['partner_id', 'source_id']);
    })
    .createTable('parity', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('partner_source_id').notNullable();
      table.text('url');
      table.text('currency').notNullable();
      table.decimal('value', 10, 2).notNullable();
      table.decimal('parity', 10, 2).notNullable();
      table.decimal('premium_parity', 10, 2);
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('partner_source_id').references('id').inTable('partner_source');
      table.index('partner_source_id');
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('parity')
    .dropTable('partner_source')
    .dropTable('partner')
    .dropTable('source')
}
