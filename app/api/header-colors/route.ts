import { NextResponse } from "next/server";
import { isLogoEditorEnabled } from "@/lib/logoPlacementStore";
import { writeHeaderColors } from "@/lib/headerColorStore";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  if (!isLogoEditorEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  return NextResponse.json(writeHeaderColors(body));
}
