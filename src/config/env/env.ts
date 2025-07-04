import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),

  POSTGRES_HOST: z.union([z.undefined(), z.string()]),
  POSTGRES_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .transform((value) => parseInt(value)),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  APP_PORT: z.union([
    z.undefined(),
    z
      .string()
      .regex(/^[0-9]+$/)
      .transform((value) => parseInt(value)),
  ]),

  WB_API_TOKEN: z.union([z.undefined(), z.string()]),
  GOOGLE_SHEET_IDS: z.union([z.undefined(), z.string()]),
  GOOGLE_CREDENTIALS_JSON: z.union([z.undefined(), z.string()]),
});

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  APP_PORT: process.env.APP_PORT,
  WB_API_TOKEN: process.env.WB_API_TOKEN,
  GOOGLE_SHEET_IDS: process.env.GOOGLE_SHEET_IDS,
  GOOGLE_CREDENTIALS_JSON: process.env.GOOGLE_CREDENTIALS_JSON,
});

export default env;
