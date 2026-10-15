import { NextResponse } from "next/server";
import { writeHeroColors } from "@/lib/heroColorStore";
import { isLogoEditorEnabled } from "@/lib/logoPlacementStore";

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

  return NextResponse.json(writeHeroColors(body));
}
