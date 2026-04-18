import { getNeonAuthServer } from "../../../../lib/neon/auth-server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const handler = (await getNeonAuthServer()).handler();
  return handler.GET(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  const handler = (await getNeonAuthServer()).handler();
  return handler.POST(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  const handler = (await getNeonAuthServer()).handler();
  return handler.PUT(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  const handler = (await getNeonAuthServer()).handler();
  return handler.PATCH(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  const handler = (await getNeonAuthServer()).handler();
  return handler.DELETE(request, context);
}
