import { initializeApp, getApps } from "firebase/app";

// Only initialize Firebase on the client side
// During SSR/SSG, return a stub
const isClient = typeof window !== "undefined";

function createClientAuthStub() {
  return new Proxy({} as Record<string, unknown>, {
    get(_, prop) {
      if (prop === "then") return undefined;
      return () =>
        Promise.reject(new Error("Firebase Auth not available during SSR"));
    },
  });
}

function getFirebaseApp() {
  if (!isClient) return null;
  if (getApps().length) return getApps()[0];

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || apiKey === "your-api-key") {
    return null;
  }

  return initializeApp({
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  });
}

const app = getFirebaseApp();

// Lazy imports for firebase modules
let _auth: Record<string, unknown> | null = null;
let _db: Record<string, unknown> | null = null;

export async function getAuth() {
  if (_auth) return _auth;
  if (!app) return createClientAuthStub();
  const { getAuth } = await import("firebase/auth");
  _auth = getAuth(app) as unknown as Record<string, unknown>;
  return _auth;
}

export async function getDb() {
  if (_db) return _db;
  if (!app) return createClientAuthStub();
  const { getFirestore } = await import("firebase/firestore");
  _db = getFirestore(app) as unknown as Record<string, unknown>;
  return _db;
}

export async function getGoogleProvider() {
  const { GoogleAuthProvider } = await import("firebase/auth");
  return new GoogleAuthProvider();
}

// ---- Auth helpers (lazy) ----

export async function signInWithGoogle() {
  const { signInWithPopup } = await import("firebase/auth");
  const auth = await getAuth();
  const provider = await getGoogleProvider();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return signInWithPopup(auth as any, provider) as any;
}

export async function signInWithEmail(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return signInWithEmailAndPassword(auth as any, email, password) as any;
}

export async function signUpWithEmail(email: string, password: string) {
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createUserWithEmailAndPassword(auth as any, email, password) as any;
}

export async function sendMagicLink(email: string) {
  const { sendSignInLinkToEmail } = await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sendSignInLinkToEmail(auth as any, email, {
    url: `${window.location.origin}/dashboard`,
    handleCodeInApp: true,
  } as any);
  localStorage.setItem("hubb-magic-email", email);
}

export function checkMagicLink(): string | null {
  if (!isClient) return null;
  // We need the Firebase auth module to check this
  // For now, just check localStorage
  return localStorage.getItem("hubb-magic-email");
}

export async function completeMagicLink(email: string) {
  const { isSignInWithEmailLink, signInWithEmailLink } =
    await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isSignInWithEmailLink(auth as any, window.location.href)) {
    throw new Error("Invalid magic link");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await signInWithEmailLink(auth as any, email, window.location.href);
  localStorage.removeItem("hubb-magic-email");
}

export async function sendPasswordReset(email: string) {
  const { sendPasswordResetEmail } = await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sendPasswordResetEmail(auth as any, email);
}

export async function signOutUser() {
  const { signOut } = await import("firebase/auth");
  const auth = await getAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await signOut(auth as any);
}
