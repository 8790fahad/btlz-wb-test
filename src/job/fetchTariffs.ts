import GoogleSheetService from "#services/GoogleSheetService.js";
import WbApiService from "#services/WbApiService.js";
import { DatePayload } from "#types.js";

export default async function fetchTariffs(date: DatePayload): Promise<void> {
    const tariffs = await WbApiService.getBoxTariffs(date);
    await WbApiService.saveOrUpdateTariffs({ tariffs, date });
}
export async function pushToSheets({ date }: DatePayload): Promise<void> {
    await GoogleSheetService.pushTariffsToSheets({ date });
}
