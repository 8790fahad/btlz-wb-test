export interface Tariff {
    warehouseName: string;
    boxDeliveryAndStorageExpr: number;
    boxDeliveryBase: number;
    boxDeliveryLiter: number;
    boxStorageBase: number | null;
    boxStorageLiter: number | null;
}

export interface TariffEntry {
    id: number;
    date: Date | string;
    warehouse_name: string;
    box_delivery_and_storage_expr: number;
    box_delivery_base: number;
    box_delivery_liter: number;
    box_storage_base: number;
    box_storage_liter: number;
    updated_at: Date | string;
}

export interface DatePayload {
    /** Date in ISO format (YYYY-MM-DD) e.g 2025-07-03 */
    date: string;
}

export interface GoogleSheetConfig {
    tariffs: Tariff[];
    date: DatePayload;
}
