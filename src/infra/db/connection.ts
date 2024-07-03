import path from "path";
import { fileURLToPath } from 'url';
import knex, { type Knex } from 'knex';

import { env } from "../env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbConfig: Knex.Config = {
  client: 'pg',
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'ts'
  },
  connection: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
}

export const connection = knex(dbConfig)