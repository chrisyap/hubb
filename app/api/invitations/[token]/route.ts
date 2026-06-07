import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const INVITATIONS_COLLECTION = "invitations";

// GET /api/invitations/[token] — get invitation by token (public, no auth)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const snapshot = await db
      .collection(INVITATIONS_COLLECTION)
      .where("token", "==", token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 },
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Check if expired
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 410 },
      );
    }

    // Check if already accepted
    if (data.status === "accepted") {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 410 },
      );
    }

    return NextResponse.json({
      id: doc.id,
      email: data.email,
      role: data.role,
      orgId: data.orgId,
      orgName: data.orgName || "",
      invitedByName: data.invitedByName || "An admin",
      expiresAt: data.expiresAt,
      status: data.status,
    });
  } catch (error) {
    console.error("Invitation GET by token error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 },
    );
  }
}
