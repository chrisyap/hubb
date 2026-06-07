import { NextRequest, NextResponse } from "next/server";
import { db, auth_admin } from "@/app/lib/firebase-admin";

export const runtime = "nodejs";

const INVITATIONS_COLLECTION = "invitations";
const USERS_COLLECTION = "members";
const ORGS_COLLECTION = "orgs";

function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// GET /api/invitations — list invitations for an org (requires auth via uid param)
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    const uid = req.nextUrl.searchParams.get("uid");

    if (!orgId) {
      return NextResponse.json({ error: "orgId required" }, { status: 400 });
    }

    // Verify the requesting user exists and is admin
    if (uid) {
      const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();
      if (!userDoc.exists || userDoc.data()?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const snapshot = await db
      .collection(INVITATIONS_COLLECTION)
      .where("orgId", "==", orgId)
      .orderBy("createdAt", "desc")
      .get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invitations: Record<string, unknown>[] = [];
    snapshot.forEach((doc: any) => {
      invitations.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(invitations, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Invitations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 },
    );
  }
}

// POST /api/invitations — create a new invitation and send email
export async function POST(req: NextRequest) {
  try {
    const { email, orgId, invitedByUid } = await req.json();

    if (!email || !orgId || !invitedByUid) {
      return NextResponse.json(
        { error: "email, orgId, and invitedByUid required" },
        { status: 400 },
      );
    }

    // Verify the inviter is an admin
    const inviterDoc = await db
      .collection(USERS_COLLECTION)
      .doc(invitedByUid)
      .get();
    if (!inviterDoc.exists || inviterDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const inviterData = inviterDoc.data();
    const invitedByName = inviterData?.name || "An admin";

    // Get org name
    const orgDoc = await db.collection(ORGS_COLLECTION).doc(orgId).get();
    const orgName = orgDoc.exists ? orgDoc.data()?.name || "the organization" : "the organization";

    // Check if user already exists in members
    const existingMembers = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingMembers.empty) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    // Check for existing pending invitation
    const existingInvites = await db
      .collection(INVITATIONS_COLLECTION)
      .where("email", "==", email)
      .where("orgId", "==", orgId)
      .where("status", "==", "pending")
      .limit(1)
      .get();

    if (!existingInvites.empty) {
      return NextResponse.json(
        { error: "A pending invitation already exists for this email" },
        { status: 409 },
      );
    }

    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = {
      email,
      role: "admin",
      orgId,
      orgName,
      invitedBy: invitedByUid,
      invitedByName,
      status: "pending" as const,
      token,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const docRef = db.collection(INVITATIONS_COLLECTION).doc();
    await docRef.set({ ...invitation, id: docRef.id });

    // Send invitation email via Resend
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteLink = `${origin}/invite/${token}`;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "invitations@hubb.app";

    if (RESEND_API_KEY && RESEND_API_KEY !== "re_placeholder_replace_with_real_key") {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(RESEND_API_KEY);

        await resend.emails.send({
          from: `${orgName} <${RESEND_FROM}>`,
          to: [email],
          subject: `You've been invited to join ${orgName} as an admin`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h1 style="color: #1b5e41;">You're Invited!</h1>
              <p>Hi there,</p>
              <p><strong>${invitedByName}</strong> has invited you to join <strong>${orgName}</strong> as an <strong>admin</strong>.</p>
              <p>Click the button below to accept the invitation and create your account:</p>
              <a href="${inviteLink}" style="display: inline-block; background-color: #1b5e41; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">
                Accept Invitation
              </a>
              <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px;">If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // Don't fail the request — the invitation is still created
      }
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
      token,
    });
  } catch (error) {
    console.error("Invitations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 },
    );
  }
}

// DELETE /api/invitations — cancel/delete an invitation
export async function DELETE(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const id = req.nextUrl.searchParams.get("id");

    if (!token && !id) {
      return NextResponse.json(
        { error: "token or id required" },
        { status: 400 },
      );
    }

    let docId = id;
    if (!docId && token) {
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
      docId = snapshot.docs[0].id;
    }

    await db.collection(INVITATIONS_COLLECTION).doc(docId!).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invitations DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 },
    );
  }
}
