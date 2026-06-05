import * as admin from "firebase-admin";

let initialized = false;

function getServiceAccount(): string {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) return json;

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path) {
    const fs = require("fs");
    return fs.readFileSync(path, "utf-8");
  }

  throw new Error(
    "Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH",
  );
}

let fbAdmin: typeof admin | null = null;

function getFirebaseAdmin() {
  if (admin.apps.length) {
    fbAdmin = admin;
    return admin;
  }
  if (initialized) return fbAdmin;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(getServiceAccount());
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    initialized = true;
    fbAdmin = admin;
  } catch {
    return null;
  }

  return admin;
}

fbAdmin = getFirebaseAdmin();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stubFirestore(): any {
  return new Proxy(
    {},
    {
      get() {
        return () =>
          Promise.reject(
            new Error(
              "Firebase not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.",
            ),
          );
      },
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stubAuth(): any {
  return new Proxy(
    {},
    {
      get() {
        return () =>
          Promise.reject(
            new Error(
              "Firebase not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.",
            ),
          );
      },
    },
  );
}

export const firebaseAdmin = fbAdmin || admin;
export const db = fbAdmin ? fbAdmin.firestore() : stubFirestore();
export const auth_admin = fbAdmin ? fbAdmin.auth() : stubAuth();
