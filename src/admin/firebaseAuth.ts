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

type FirebaseSdk = {
  auth: unknown;
  browserLocalPersistence: unknown;
  GoogleAuthProvider: new () => {
    setCustomParameters(parameters: Record<string, string>): void;
  };
  onAuthStateChanged(
    auth: unknown,
    observer: (user: FirebaseUser | null) => void | Promise<void>,
  ): () => void;
  setPersistence(auth: unknown, persistence: unknown): Promise<void>;
  signInWithPopup(auth: unknown, provider: unknown): Promise<{ user: FirebaseUser }>;
  signInWithRedirect(auth: unknown, provider: unknown): Promise<void>;
  signOut(auth: unknown): Promise<void>;
};

let sdkPromise: Promise<FirebaseSdk | null> | null = null;

function firebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
}

export function isFirebaseAuthConfigured() {
  const config = firebaseConfig();
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

async function loadFirebase(): Promise<FirebaseSdk | null> {
  if (!isFirebaseAuthConfigured()) return null;
  if (sdkPromise) return sdkPromise;

  sdkPromise = (async () => {
    const appUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`;
    const authUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`;

    const appModule = await import(/* @vite-ignore */ appUrl);
    const authModule = await import(/* @vite-ignore */ authUrl);

    const config = firebaseConfig();
    const appName = "xarcon-admin";
    const existingApp = appModule
      .getApps()
      .find((candidate: { name?: string }) => candidate.name === appName);
    const app = existingApp ?? appModule.initializeApp(config, appName);

    const auth = authModule.getAuth(app);
    await authModule.setPersistence(auth, authModule.browserLocalPersistence);

    return {
      auth,
      browserLocalPersistence: authModule.browserLocalPersistence,
      GoogleAuthProvider: authModule.GoogleAuthProvider,
      onAuthStateChanged: authModule.onAuthStateChanged,
      setPersistence: authModule.setPersistence,
      signInWithPopup: authModule.signInWithPopup,
      signInWithRedirect: authModule.signInWithRedirect,
      signOut: authModule.signOut,
    } satisfies FirebaseSdk;
  })();

  return sdkPromise;
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
  const sdk = await loadFirebase();

  if (!sdk) {
    observer({ status: "unconfigured" });
    return () => undefined;
  }

  return sdk.onAuthStateChanged(sdk.auth, async (user) => {
    if (!user) {
      observer({ status: "signed-out" });
      return;
    }

    if (!isOwner(user)) {
      const attemptedEmail = user.email;
      observer({ status: "forbidden", attemptedEmail });
      await sdk.signOut(sdk.auth);
      return;
    }

    observer({ status: "authorized", user: toIdentity(user) });
  });
}

export async function signInAdminWithGoogle() {
  const sdk = await loadFirebase();
  if (!sdk) throw new Error("firebase-unconfigured");

  const provider = new sdk.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await sdk.signInWithPopup(sdk.auth, provider);

    if (!isOwner(result.user)) {
      await sdk.signOut(sdk.auth);
      throw new Error("owner-only");
    }

    return toIdentity(result.user);
  } catch (error) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";

    if (code === "auth/popup-blocked") {
      await sdk.signInWithRedirect(sdk.auth, provider);
      return null;
    }

    throw error;
  }
}

export async function signOutAdmin() {
  const sdk = await loadFirebase();
  if (!sdk) return;
  await sdk.signOut(sdk.auth);
}
