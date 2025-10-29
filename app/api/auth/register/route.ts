import { NextResponse } from "next/server";
import { createHandler, requestIdMiddleware } from "../../middleware";

export const POST = createHandler(async () => {
	return NextResponse.json({ message: "create an account" });
}, requestIdMiddleware);
