import { env } from "../env";

export const GET = async () => {
	console.log("Health check", env.DATABASE_URL);
	return Response.json({ message: "Server is running" });
};
