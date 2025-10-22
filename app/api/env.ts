import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	APP_STAGE: z.enum(["dev", "prod", "test"]).default("dev"),
	PORT: z.coerce.number().positive().default(3000),
	DATABASE_URL: z.string().startsWith("postgresql://"),
	JWT_SECRET: z
		.string()
		.min(32, "JWT_SECRET must be at least 32 characters long"),
	JWT_EXPIRES_IN: z.string().default("7d"),
	BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;

try {
	env = envSchema.parse(process.env);
} catch (e) {
	if (e instanceof z.ZodError) {
		console.log("invalid environment variables");
		console.error(JSON.stringify(e.flatten().fieldErrors, null, 2));
		e.issues.forEach((error) => {
			const path = error.path.join(".");
			console.log(`${path}: ${error.message}`);
		});
		process.exit(1);
	}

	throw e;
}

export const isProd = () => env.APP_STAGE === "prod";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
