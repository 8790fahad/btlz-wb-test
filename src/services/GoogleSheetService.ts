import { google } from "googleapis";
import knex from "knex";
import knexConfig from "#config/knex/knexfile.js";
import { format } from "date-fns";
import { DatePayload, TariffEntry } from "#types.js";
import env from "#config/env/env.js";
const db = knex(knexConfig);

class GoogleSheetService {
    private static async getAuthClient() {
        const credentialsJson = env.GOOGLE_CREDENTIALS_JSON;

        if (!credentialsJson) {
            throw new Error("Missing Google credentials JSON in env");
        }

        const credentials = JSON.parse(credentialsJson);

        return new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }

    public static async pushTariffsToSheets({ date }: DatePayload): Promise<void> {
        try {
            const tariffs: TariffEntry[] = await db<TariffEntry>("tariffs").where("date", date).orderBy("box_delivery_and_storage_expr", "asc");
            if (tariffs.length === 0) {
                console.warn(`[Google Sheets Sync] No tariffs found for date: ${date}`);
                return;
            }
            const rows = [
                [
                    "ID",
                    "Warehouse",
                    "Box Delivery + Storage Expr",
                    "Box Delivery Base",
                    "Box Delivery Liter",
                    "Box Storage Base",
                    "Box Storage Liter",
                    "Updated At",
                ],
                ...tariffs.map((t, i) => [
                    i + 1,
                    t.warehouse_name,
                    t.box_delivery_and_storage_expr,
                    t.box_delivery_base,
                    t.box_delivery_liter,
                    t.box_storage_base !== null ? t.box_storage_base : "N/A",
                    t.box_storage_liter !== null ? t.box_storage_liter : "N/A",
                    t.updated_at ? format(new Date(t.updated_at), "yyyy-MM-dd HH:mm:ss") : "N/A",
                ]),
            ];
            const sheetIds = (env.GOOGLE_SHEET_IDS ?? "")
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id.length > 0);

            if (sheetIds.length === 0) {
                console.error("[Google Sheets Sync] No Google Sheet IDs found in GOOGLE_SHEET_IDS environment variable");
                return;
            }
            const authClient = await this.getAuthClient();
            const sheets = google.sheets({ version: "v4", auth: authClient });

            for (const sheetId of sheetIds) {
                try {
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: sheetId,
                        range: "stocks_coefs!A1",
                        valueInputOption: "RAW",
                        requestBody: { values: rows },
                    });
                    console.log(`Successfully updated Google Sheet ${sheetId}`);
                } catch (error: any) {
                    console.error(` Failed to update sheet ${sheetId}:`, error.message || error);
                }
            }
        } catch (error: any) {
            console.error(" Error pushing tariffs to sheets:", error.message || error);
        }
    }
}

export default GoogleSheetService;
