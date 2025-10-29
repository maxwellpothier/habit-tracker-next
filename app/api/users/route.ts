import { NextResponse } from "next/server";
import { createHandler, requestIdMiddleware } from "../middleware";

export const GET = createHandler(async () => {
	return NextResponse.json({ message: "Get users here" });
}, requestIdMiddleware);
