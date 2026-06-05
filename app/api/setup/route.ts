import { NextRequest, NextResponse } from "next/server";
import { db, auth_admin, firebaseAdmin } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const ORGS_COLLECTION = "orgs";
const USERS_COLLECTION = "members";

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "uid required" }, { status: 400 });
    }

    // Check if org exists
    const orgsSnap = await db.collection(ORGS_COLLECTION).limit(1).get();
    const orgExists = !orgsSnap.empty;

    // Check if user already has a profile
    const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();

    return NextResponse.json({
      needsSetup: !orgExists || !userDoc.exists,
      orgExists,
      hasProfile: userDoc.exists,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json({ error: "Setup check failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { uid, email, name, orgName } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "uid and email required" },
        { status: 400 },
      );
    }

    const orgSlug =
      orgName?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "my-community";
    const orgId = orgSlug;

    // Check if org already exists
    const orgDoc = await db.collection(ORGS_COLLECTION).doc(orgId).get();

    if (!orgDoc.exists) {
      // Create the org
      await db
        .collection(ORGS_COLLECTION)
        .doc(orgId)
        .set({
          name: orgName || "My Community",
          slug: orgId,
          logo: "",
          primaryColor: "var(--color-primary)",
          accentColor: "var(--color-accent)",
          createdAt: new Date().toISOString(),
          createdBy: uid,
        });
    }

    // Create/update user profile
    await db
      .collection(USERS_COLLECTION)
      .doc(uid)
      .set(
        {
          uid,
          email,
          name: name || email.split("@")[0],
          role: "admin",
          orgId,
          orgName: orgName || "My Community",
          joinedAt: orgDoc.exists
            ? (await db.collection(USERS_COLLECTION).doc(uid).get()).data()
                ?.joinedAt
            : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

    // Set admin custom claim
    await auth_admin.setCustomUserClaims(uid, {
      admin: true,
      orgId,
    });

    return NextResponse.json({
      success: true,
      orgId,
      role: "admin",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
