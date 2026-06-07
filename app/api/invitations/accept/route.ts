import { NextRequest, NextResponse } from "next/server";
import { db, auth_admin } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const INVITATIONS_COLLECTION = "invitations";
const USERS_COLLECTION = "members";

// POST /api/invitations/accept — accept an invitation and create the user as admin
export async function POST(req: NextRequest) {
  try {
    const { token, uid, email, name } = await req.json();

    if (!token || !uid || !email) {
      return NextResponse.json(
        { error: "token, uid, and email required" },
        { status: 400 },
      );
    }

    // Find the invitation
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

    const inviteDoc = snapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Validate invitation status
    if (inviteData.status === "accepted") {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 410 },
      );
    }

    if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 410 },
      );
    }

    // Verify the email matches
    if (inviteData.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 403 },
      );
    }

    const orgId = inviteData.orgId;
    const orgName = inviteData.orgName || "My Community";

    // Check if user profile already exists
    const existingUser = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (existingUser.exists) {
      return NextResponse.json(
        { error: "User profile already exists" },
        { status: 409 },
      );
    }

    // Create user profile with admin role
    await db
      .collection(USERS_COLLECTION)
      .doc(uid)
      .set({
        uid,
        email,
        name: name || email.split("@")[0],
        role: "admin",
        orgId,
        orgName,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Set admin custom claim
    try {
      await auth_admin.setCustomUserClaims(uid, {
        admin: true,
        orgId,
      });
    } catch (claimsError) {
      console.error("Failed to set custom claims:", claimsError);
      // Non-fatal — the role is in the Firestore profile
    }

    // Mark invitation as accepted
    await inviteDoc.ref.update({
      status: "accepted",
      acceptedBy: uid,
      acceptedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orgId,
      orgName,
      role: "admin",
    });
  } catch (error) {
    console.error("Invitation accept error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
