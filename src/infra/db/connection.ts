import { env } from "../env.js";
import knex from "knex";

export const connection = knex({
  client: 'postgresql',
  connection: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
})