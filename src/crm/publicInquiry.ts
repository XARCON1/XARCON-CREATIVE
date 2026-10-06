import {
  XARCON_FIREBASE_CONFIG,
  XARCON_FIREBASE_PUBLIC_APP_NAME,
} from "../firebaseConfig";

const FIREBASE_SDK_VERSION = "12.19.0";
const SUBMISSION_COOLDOWN_MS = 45_000;
const LAST_SUBMISSION_KEY = "xarcon:last-crm-submission";

type PublicInquiryInput = {
  name: string;
  email: string;
  company?: string;
  need: string;
  budget?: string;
  message: string;
};

type FirestoreDocumentRef = {
  id: string;
  set(data: Record<string, unknown>): Promise<void>;
};

type FirestoreCollectionRef = {
  doc(id?: string): FirestoreDocumentRef;
};

type FirestoreDb = {
  collection(path: string): FirestoreCollectionRef;
};

type FirebaseCompat = {
  apps: Array<{ name: string }>;
  initializeApp(config: Record<string, string>, name?: string): unknown;
  app(name?: string): unknown;
  firestore(app?: unknown): FirestoreDb;
};

let dbPromise: Promise<FirestoreDb> | null = null;

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

async function getDb() {
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`,
    );
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore-compat.js`,
    );

    const firebase = (window as Window & { firebase?: FirebaseCompat }).firebase;
    if (!firebase) throw new Error("firebase-sdk-unavailable");

    const existingApp = firebase.apps.find(
      (candidate) => candidate.name === XARCON_FIREBASE_PUBLIC_APP_NAME,
    );
    const app = existingApp
      ? firebase.app(XARCON_FIREBASE_PUBLIC_APP_NAME)
      : firebase.initializeApp(
          XARCON_FIREBASE_CONFIG,
          XARCON_FIREBASE_PUBLIC_APP_NAME,
        );

    return firebase.firestore(app);
  })();

  return dbPromise;
}

function assertInput(input: PublicInquiryInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();
  const need = input.need.trim();

  if (name.length < 2 || name.length > 100) throw new Error("invalid-name");
  if (email.length < 5 || email.length > 200 || !email.includes("@")) {
    throw new Error("invalid-email");
  }
  if (need.length < 2 || need.length > 120) throw new Error("invalid-need");
  if (message.length < 10 || message.length > 4000) throw new Error("invalid-message");
}

export async function submitPublicInquiry(input: PublicInquiryInput) {
  assertInput(input);

  const previous = Number(window.localStorage.getItem(LAST_SUBMISSION_KEY) || "0");
  if (Date.now() - previous < SUBMISSION_COOLDOWN_MS) {
    throw new Error("submission-rate-limited");
  }

  const db = await getDb();
  const ref = db.collection("crmConversations").doc();
  const now = new Date().toISOString();
  const message = input.message.trim();

  await ref.set({
    source: "website",
    channel: "web_form",
    status: "new",
    contactName: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: "",
    company: (input.company || "").trim(),
    clientId: "",
    subject: input.need.trim(),
    initialMessage: message,
    preview: message.slice(0, 180),
    budget: (input.budget || "").trim(),
    assignedTo: "",
    unreadCount: 1,
    automationEligible: false,
    externalConversationId: "",
    externalContactId: "",
    createdAt: now,
    updatedAt: now,
  });

  window.localStorage.setItem(LAST_SUBMISSION_KEY, String(Date.now()));
  return ref.id;
}
