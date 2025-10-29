import { NextResponse } from "next/server";
import {
	createHandler,
	requestIdMiddleware,
	validateBodyMiddleware,
} from "../middleware";

export const GET = createHandler(async () => {
	return NextResponse.json({ message: "Get habits here" });
}, requestIdMiddleware);

export const POST = createHandler(async () => {
	return NextResponse.json({ message: "Create a habit here" });
}, validateBodyMiddleware);
