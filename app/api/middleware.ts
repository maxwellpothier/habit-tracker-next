import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

type Context = {
	startTime?: number;
	[key: string]: unknown;
};

const BodySchema = z.object({
	name: z.string().min(1),
});

type ContextHandler = (
	req: NextRequest,
	context: Context
) => Promise<NextResponse>;

type Middleware = (
	req: NextRequest,
	context: Context,
	next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export const createHandler = (
	handler: ContextHandler,
	...middlewares: Middleware[]
): ((req: NextRequest) => Promise<NextResponse>) => {
	return async (req: NextRequest) => {
		const context: Context = {};

		const runMiddleware = async (index: number): Promise<NextResponse> => {
			if (index === middlewares.length) {
				return handler(req, context);
			}

			const middleware = middlewares[index];
			return middleware(req, context, () => runMiddleware(index + 1));
		};

		return runMiddleware(0);
	};
};

export const requestIdMiddleware: Middleware = async (req, context, next) => {
	const requestId = randomUUID();
	context.requestId = requestId;
	const response = await next();
	response.headers.set("x-request-id", requestId);
	return response;
};

export const validateBodyMiddleware: Middleware = async (
	req,
	context,
	next
) => {
	const body = await req.json();
	console.log("body", body);
	try {
		const validatedBody = BodySchema.parse(body);
		context.validatedBody = validatedBody;
		return next();
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.log("zod error");
			return NextResponse.json(
				{ error: "Invalid body" },
				{ status: 400 }
			);
		}
		throw e;
	}
};
