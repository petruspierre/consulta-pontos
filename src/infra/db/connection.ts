import knex, { type Knex } from "knex";

import { env } from "../env.js";

export const dbConfig: Knex.Config = {
	client: "pg",
	migrations: {
		directory: "./src/infra/db/migrations",
		extension: "ts",
	},
	seeds: {
		directory: "./src/infra/db/seeds",
		extension: "ts",
	},
	connection: {
		host: env.DATABASE_HOST,
		port: env.DATABASE_PORT,
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		database: env.DATABASE_NAME,
	},
};

export const db: Knex = knex(dbConfig);
