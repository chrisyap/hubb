import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

const ORGS_COLLECTION = "orgs";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId) {
      return NextResponse.json({ error: "orgId required" }, { status: 400 });
    }

    const doc = await db.collection(ORGS_COLLECTION).doc(orgId).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Org not found" }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Org GET error:", error);
    return NextResponse.json({ error: "Failed to fetch org" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, ...data } = body;

    if (!orgId) {
      return NextResponse.json({ error: "orgId required" }, { status: 400 });
    }

    await db.collection(ORGS_COLLECTION).doc(orgId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Org PUT error:", error);
    return NextResponse.json({ error: "Failed to update org" }, { status: 500 });
  }
}
