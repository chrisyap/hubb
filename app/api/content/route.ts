import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-admin";

// Generic content API — handles all content types via ?collection= param
// Collections: events, news, programs, documents, pages, committee_members, sponsors

const VALID_COLLECTIONS = new Set([
  "events",
  "news",
  "programs",
  "documents",
  "pages",
  "committee_members",
  "sponsors",
  "invitations",
]);

export const runtime = "nodejs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirestoreDoc = any;

export async function GET(req: NextRequest) {
  try {
    const collection = req.nextUrl.searchParams.get("collection");
    const orgId = req.nextUrl.searchParams.get("orgId");

    if (!collection || !VALID_COLLECTIONS.has(collection)) {
      return NextResponse.json(
        { error: "Invalid collection" },
        { status: 400 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let collectionRef: any = db.collection(collection);

    if (orgId) {
      collectionRef = collectionRef.where("orgId", "==", orgId);
    }

    collectionRef = collectionRef.orderBy("createdAt", "desc");

    const snapshot = await collectionRef.get();
    const items: FirestoreDoc[] = [];
    snapshot.forEach((doc: FirestoreDoc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection, ...data } = body;

    if (!collection || !VALID_COLLECTIONS.has(collection)) {
      return NextResponse.json(
        { error: "Invalid collection" },
        { status: 400 },
      );
    }

    const docRef = db.collection(collection).doc();
    await docRef.set({
      ...data,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection, id, ...data } = body;

    if (!collection || !VALID_COLLECTIONS.has(collection) || !id) {
      return NextResponse.json(
        { error: "collection and id required" },
        { status: 400 },
      );
    }

    await db
      .collection(collection)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content PUT error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const collection = req.nextUrl.searchParams.get("collection");
    const id = req.nextUrl.searchParams.get("id");

    if (!collection || !VALID_COLLECTIONS.has(collection) || !id) {
      return NextResponse.json(
        { error: "collection and id required" },
        { status: 400 },
      );
    }

    await db.collection(collection).doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
