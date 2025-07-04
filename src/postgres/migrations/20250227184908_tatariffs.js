/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.date("date").notNullable();
        table.string("warehouse_name").notNullable();
        table.decimal("box_delivery_and_storage_expr").notNullable();
        table.decimal("box_delivery_base").notNullable();
        table.decimal("box_delivery_liter").notNullable();
        table.decimal("box_storage_base").notNullable();
        table.decimal("box_storage_liter").notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}
