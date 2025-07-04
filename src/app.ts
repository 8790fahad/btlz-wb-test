import knex, { migrate, seed } from "#postgres/knex.js";

import express from "express";
import cron from "node-cron";
import env from "#config/env/env.js";
import fetchTariffs, { pushToSheets } from "#job/fetchTariffs.js";
import { format } from "date-fns";
import { DatePayload } from "#types.js";
import statusRouter from "#routes/status.js";

await migrate.latest();
await seed.run();

const app = express();
app.use(express.json());

app.use(express.json());

app.use(express.json());
cron.schedule("0 * * * *", async () => {
    const date = format(new Date(), "yyyy-MM-dd");
    console.log(`[${new Date().toISOString()}] Hourly: Fetching WB tariffs for ${date}`);
    await fetchTariffs({ date } as DatePayload);
});

cron.schedule("0 0 * * *", async () => {
    const date = format(new Date(), "yyyy-MM-dd");
    console.log(`[${new Date().toISOString()}] Daily: Pushing data to Google Sheets for ${date}`);
    await pushToSheets({ date } as DatePayload);
});

const PORT = env.APP_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
