import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

type Context = {
	startTime?: number;
	[key: string]: unknown;
};

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
