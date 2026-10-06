import { XARCON_FIREBASE_APP_NAME, XARCON_FIREBASE_CONFIG } from "../firebaseConfig";

const FIREBASE_SDK_VERSION = "12.19.0";
export const XARCON_OWNER_EMAIL = "norvingarcia220@gmail.com";

export type AdminIdentity = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};

export type AdminAuthSnapshot =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "forbidden"; attemptedEmail: string | null }
  | { status: "authorized"; user: AdminIdentity };

type FirebaseUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  providerData: Array<{ providerId?: string | null }>;
};

type CompatAuth = {
  currentUser: FirebaseUser | null;
  onAuthStateChanged(observer: (user: FirebaseUser | null) => void | Promise<void>): () => void;
  setPersistence(persistence: unknown): Promise<void>;
  signInWithPopup(provider: unknown): Promise<{ user: FirebaseUser }>;
  signInWithRedirect(provider: unknown): Promise<void>;
  signOut(): Promise<void>;
};

type FirebaseCompat = {
  apps: Array<{ name: string }>;
  initializeApp(config: Record<string, string | undefined>, name?: string): unknown;
  app(name?: string): unknown;
  auth: {
    (app?: unknown): CompatAuth;
    GoogleAuthProvider: new () => {
      setCustomParameters(parameters: Record<string, string>): void;
    };
    Auth: {
      Persistence: {
        LOCAL: unknown;
      };
    };
  };
};

declare global {
  interface Window {
    firebase?: FirebaseCompat;
  }
}

let firebasePromise: Promise<FirebaseCompat | null> | null = null;

function firebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || XARCON_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || XARCON_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || XARCON_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || XARCON_FIREBASE_CONFIG.storageBucket,
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      XARCON_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || XARCON_FIREBASE_CONFIG.appId,
    measurementId:
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
      XARCON_FIREBASE_CONFIG.measurementId,
  };
}

export function isFirebaseAuthConfigured() {
  const config = firebaseConfig();
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("firebase-sdk-load-failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error("firebase-sdk-load-failed")), { once: true });
    document.head.appendChild(script);
  });
}

async function loadFirebase(): Promise<FirebaseCompat | null> {
  if (!isFirebaseAuthConfigured()) return null;
  if (firebasePromise) return firebasePromise;

  firebasePromise = (async () => {
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`,
    );
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth-compat.js`,
    );

    const firebase = window.firebase;
    if (!firebase) throw new Error("firebase-sdk-unavailable");

    const config = firebaseConfig();
    const appName = XARCON_FIREBASE_APP_NAME;
    const existingApp = firebase.apps.find((candidate) => candidate.name === appName);
    const app = existingApp ? firebase.app(appName) : firebase.initializeApp(config, appName);
    const auth = firebase.auth(app);
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    return firebase;
  })();

  return firebasePromise;
}

async function getAuth() {
  const firebase = await loadFirebase();
  if (!firebase) return null;
  return firebase.auth(firebase.app(XARCON_FIREBASE_APP_NAME));
}

function isOwner(user: FirebaseUser) {
  const email = user.email?.trim().toLowerCase();
  const googleIdentity = user.providerData.some((provider) => provider.providerId === "google.com");

  return (
    email === XARCON_OWNER_EMAIL &&
    user.emailVerified === true &&
    googleIdentity
  );
}

function toIdentity(user: FirebaseUser): AdminIdentity {
  return {
    uid: user.uid,
    email: user.email?.trim().toLowerCase() ?? "",
    displayName: user.displayName?.trim() || "Owner XARCON",
    photoURL: user.photoURL,
  };
}

export async function observeAdminAuth(
  observer: (snapshot: AdminAuthSnapshot) => void,
): Promise<() => void> {
  const auth = await getAuth();

  if (!auth) {
    observer({ status: "unconfigured" });
    return () => undefined;
  }

  return auth.onAuthStateChanged(async (user) => {
    if (!user) {
      observer({ status: "signed-out" });
      return;
    }

    if (!isOwner(user)) {
      const attemptedEmail = user.email;
      observer({ status: "forbidden", attemptedEmail });
      await auth.signOut();
      return;
    }

    observer({ status: "authorized", user: toIdentity(user) });
  });
}

export async function signInAdminWithGoogle() {
  const firebase = await loadFirebase();
  if (!firebase) throw new Error("firebase-unconfigured");

  const auth = firebase.auth(firebase.app(XARCON_FIREBASE_APP_NAME));
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await auth.signInWithPopup(provider);

    if (!isOwner(result.user)) {
      await auth.signOut();
      throw new Error("owner-only");
    }

    return toIdentity(result.user);
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";

    if (code === "auth/popup-blocked") {
      await auth.signInWithRedirect(provider);
      return null;
    }

    throw error;
  }
}

export async function signOutAdmin() {
  const auth = await getAuth();
  if (!auth) return;
  await auth.signOut();
}
