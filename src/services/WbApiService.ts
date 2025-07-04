import axios from "axios";

import knex from "knex";
import knexConfig from "#config/knex/knexfile.js";
import { DatePayload, Tariff, GoogleSheetConfig } from "#types.js";
import env from "#config/env/env.js";
import { parseLocalizedFloat } from "#utils/utils.js";

const db = knex(knexConfig);

class WbApiService {
    static async getBoxTariffs({ date }: DatePayload): Promise<Tariff[]> {
        try {
            const token = env.WB_API_TOKEN;
            const response = await axios.get(`https://common-api.wildberries.ru/api/v1/tariffs/box?date=${date}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const warehouses = response.data?.response?.data?.warehouseList;
            if (!Array.isArray(warehouses)) {
                throw new Error("Unexpected API response format: warehouseList not found");
            }
            return warehouses.map(
                (item: any): Tariff => ({
                    warehouseName: item.warehouseName?.trim() || "Unknown",
                    boxDeliveryBase: parseLocalizedFloat(item.boxDeliveryBase),
                    boxDeliveryAndStorageExpr: parseLocalizedFloat(item.boxDeliveryAndStorageExpr ?? item.boxDeliveryBase),
                    boxDeliveryLiter: parseLocalizedFloat(item.boxDeliveryLiter),
                    boxStorageBase: parseLocalizedFloat(item.boxStorageBase),
                    boxStorageLiter: parseLocalizedFloat(item.boxStorageLiter),
                }),
            );
        } catch (error) {
            console.error("Error fetching box tariffs:", error);
            return [];
        }
    }
    static async saveOrUpdateTariffs({ tariffs, date }: GoogleSheetConfig): Promise<void> {
        await db.transaction(async (trx) => {
            for (const tariff of tariffs) {
                const warehouse = tariff.warehouseName;

                const existing = await trx("tariffs").where({ date: date.date, warehouse_name: warehouse }).first();

                const data = {
                    date: date.date,
                    warehouse_name: warehouse,
                    box_delivery_and_storage_expr: tariff.boxDeliveryAndStorageExpr,
                    box_delivery_base: tariff.boxDeliveryBase,
                    box_delivery_liter: tariff.boxDeliveryLiter,
                    box_storage_base: tariff.boxStorageBase,
                    box_storage_liter: tariff.boxStorageLiter,
                    updated_at: trx.fn.now(),
                };

                if (existing) {
                    const hasChanges =
                        existing.box_delivery_and_storage_expr !== data.box_delivery_and_storage_expr ||
                        existing.box_delivery_base !== data.box_delivery_base ||
                        existing.box_delivery_liter !== data.box_delivery_liter ||
                        existing.box_storage_base !== data.box_storage_base ||
                        existing.box_storage_liter !== data.box_storage_liter;

                    if (hasChanges) {
                        await trx("tariffs").where({ id: existing.id }).update(data);
                    }
                } else {
                    await trx("tariffs").insert(data);
                }
            }
        });
    }
}


export default WbApiService;
