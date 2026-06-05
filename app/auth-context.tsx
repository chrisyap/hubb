"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import {
  getAuth,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  sendMagicLink,
  completeMagicLink,
  signOutUser,
} from "@/app/lib/firebase-client";

export type OrgInfo = {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  accentColor?: string;
  domain?: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  role: "admin" | "member";
  orgId: string;
  orgName: string;
  joinedAt: string;
};

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseReady: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  completeMagicLink: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseUser(
  fbUser: FirebaseUser,
  profile?: Partial<UserProfile>,
): UserProfile {
  return {
    uid: fbUser.uid,
    email: fbUser.email || "",
    name:
      profile?.name ||
      fbUser.displayName ||
      fbUser.email?.split("@")[0] ||
      "User",
    photoURL: fbUser.photoURL || undefined,
    role: profile?.role || "member",
    orgId: profile?.orgId || "",
    orgName: profile?.orgName || "",
    joinedAt: profile?.joinedAt || new Date().toISOString(),
  };
}

async function fetchUserProfile(
  uid: string,
): Promise<Partial<UserProfile> | null> {
  try {
    const res = await fetch(`/api/users/${uid}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  const refreshUser = useCallback(async () => {
    const fbUser = await getFirebaseUser();
    if (!fbUser) {
      setUser(null);
      return;
    }
    const profile = await fetchUserProfile(fbUser.uid);
    setUser(parseUser(fbUser, profile || undefined));
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function init() {
      const auth = (await getAuth()) as ReturnType<
        typeof onAuthStateChanged
      > extends (auth: infer A) => unknown
        ? A
        : never;

      // Hmm, getAuth returns a stub or real auth. Let me just import firebase/auth dynamically.
      try {
        const { getAuth: getFirebaseAuth } = await import("firebase/auth");
        const { initializeApp, getApps } = await import("firebase/app");

        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!apiKey || apiKey === "your-api-key") {
          setIsLoading(false);
          setIsFirebaseReady(true);
          return;
        }

        const app = getApps().length
          ? getApps()[0]
          : initializeApp({
              apiKey,
              authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
              storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
              messagingSenderId:
                process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            });

        const firebaseAuth = getFirebaseAuth(app);

        unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
          setIsFirebaseReady(true);

          if (fbUser) {
            try {
              const checkRes = await fetch(`/api/setup?uid=${fbUser.uid}`);
              const setupData = await checkRes.json();

              if (setupData.needsSetup) {
                await fetch("/api/setup", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    uid: fbUser.uid,
                    email: fbUser.email,
                    name:
                      fbUser.displayName ||
                      fbUser.email?.split("@")[0] ||
                      "Admin",
                    orgName: process.env.NEXT_PUBLIC_ORG_NAME || "My Community",
                  }),
                });
              }

              const profile = await fetchUserProfile(fbUser.uid);
              setUser(parseUser(fbUser, profile || undefined));
            } catch {
              setUser(parseUser(fbUser));
            }
          } else {
            setUser(null);
          }

          setIsLoading(false);
        });
      } catch {
        // Firebase not configured
        setIsFirebaseReady(true);
        setIsLoading(false);
      }
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { signInWithPopup, GoogleAuthProvider } =
      await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

    const auth = await (await import("firebase/auth")).getAuth(app);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Auth state change will trigger the listener
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { signInWithEmailAndPassword, getAuth } =
      await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    const { createUserWithEmailAndPassword, getAuth } =
      await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

    const auth = getAuth(app);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = result.user;

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: fbUser.uid,
        email: fbUser.email,
        name,
      }),
    });
  };

  const handleSendMagicLink = async (email: string) => {
    const { sendSignInLinkToEmail, getAuth } = await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

    const auth = getAuth(app);
    await sendSignInLinkToEmail(auth, email, {
      url: `${window.location.origin}/admin/dashboard`,
      handleCodeInApp: true,
    });
    localStorage.setItem("hubb-magic-email", email);
  };

  const handleCompleteMagicLink = async () => {
    const { isSignInWithEmailLink, signInWithEmailLink, getAuth } =
      await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });

    const auth = getAuth(app);
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      throw new Error("Invalid magic link");
    }
    const email = localStorage.getItem("hubb-magic-email");
    if (!email) throw new Error("No magic email found");
    await signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem("hubb-magic-email");
  };

  const logout = async () => {
    const { signOut, getAuth } = await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        });

    const auth = getAuth(app);
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirebaseReady,
        loginWithGoogle,
        loginWithEmail,
        signUp: handleSignUp,
        sendMagicLink: handleSendMagicLink,
        completeMagicLink: handleCompleteMagicLink,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Helper to get current Firebase user
async function getFirebaseUser(): Promise<FirebaseUser | null> {
  try {
    const { getAuth, onAuthStateChanged } = await import("firebase/auth");
    const { initializeApp, getApps } = await import("firebase/app");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({ apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY });

    const auth = getAuth(app);
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  } catch {
    return null;
  }
}
