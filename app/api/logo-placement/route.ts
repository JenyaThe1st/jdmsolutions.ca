import { NextResponse } from "next/server";
import {
  isLogoEditorEnabled,
  writeLogoPlacement,
} from "@/lib/logoPlacementStore";

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

  const placement = writeLogoPlacement(body);
  return NextResponse.json(placement);
}
