import { config } from "dotenv";
config();

if (!process.env.API_PORT) throw new Error(`API_PORT must be provided`)
export const CONFIG_API_PORT = process.env.API_PORT

if (!process.env.OPPONENT_URI) throw new Error(`OPPONENT_URI must be provided`)
export const CONFIG_OPPONENT_URI = process.env.OPPONENT_URI

if (!process.env.MONGO_URI) throw new Error(`MONGO_URI must be provided`)
export const CONFIG_MONGO_URI = process.env.MONGO_URI