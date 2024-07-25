import "dotenv/config";
import z from "zod";

const envSchema = z.object({
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_NAME: z.string(),
	DATABASE_HOST: z.string().default("localhost"),
	DATABASE_PORT: z.coerce.number().default(5432),
	PORT: z.coerce.number().default(3366),
	ENVIRONMENT: z.string().default("development"),
});

const envValidation = envSchema.safeParse({
	DATABASE_USER: process.env.DATABASE_USER,
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
	DATABASE_NAME: process.env.DATABASE_NAME,
	DATABASE_HOST: process.env.DATABASE_HOST,
	DATABASE_PORT: process.env.DATABASE_PORT,
	PORT: process.env.PORT,
	ENVIRONMENT: process.env.ENVIRONMENT,
});

if (!envValidation.success) {
	const errors = envValidation.error.errors.map(
		(err) => `\n${err.path} - ${err.message}`,
	);
	throw new Error(`Invalid environment variables: ${errors}`);
}

export const env = envValidation.data;
