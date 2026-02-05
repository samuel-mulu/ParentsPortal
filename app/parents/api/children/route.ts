import { NextResponse } from "next/server";
import { getChildrenByIds } from "@/lib/parents";

export async function POST(req: Request) {
  const { ids } = await req.json();

  if (!Array.isArray(ids)) {
    return NextResponse.json([], { status: 400 });
  }

  const children = await getChildrenByIds(ids);
  return NextResponse.json(children);
}
