import { config } from "dotenv";
config();

if (!process.env.API_PORT) throw new Error(`API_PORT must be provided`)
export const CONFIG_API_PORT = process.env.API_PORT