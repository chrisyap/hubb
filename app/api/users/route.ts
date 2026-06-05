import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

const USERS_COLLECTION = "members";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, name } = await req.json();
    if (!uid || !email) {
      return NextResponse.json({ error: "uid and email required" }, { status: 400 });
    }

    // Find the org (first one — single-tenant white-label)
    const orgsSnap = await db.collection("orgs").limit(1).get();
    let orgId = "";
    let orgName = "My Community";

    if (!orgsSnap.empty) {
      const orgData = orgsSnap.docs[0].data();
      orgId = orgsSnap.docs[0].id;
      orgName = orgData.name || orgName;
    }

    await db.collection(USERS_COLLECTION).doc(uid).set({
      uid,
      email,
      name: name || email.split("@")[0],
      role: "member",
      orgId,
      orgName,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
