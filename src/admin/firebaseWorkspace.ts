import {
  XARCON_FIREBASE_CONFIG,
} from "./firebaseAuth";
import type {
  Client,
  FinanceMovement,
  Opportunity,
  Project,
  Receivable,
  Task,
} from "./data";

const FIREBASE_SDK_VERSION = "12.19.0";
const APP_NAME = "xarcon-admin";
const WORKSPACE_ID = "xarcon";

export type WorkspaceLiveSnapshot = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
  movements: FinanceMovement[];
};

export type WorkspaceConnection = "idle" | "connecting" | "live" | "error";

type FirestoreDoc = {
  id: string;
  exists: boolean;
  data(): Record<string, unknown> | undefined;
};

type FirestoreQuerySnapshot = {
  docs: FirestoreDoc[];
};

type FirestoreDocumentRef = {
  id: string;
  get(): Promise<FirestoreDoc>;
  set(data: Record<string, unknown>): Promise<void>;
  update(data: Record<string, unknown>): Promise<void>;
};

type FirestoreCollectionRef = {
  doc(id?: string): FirestoreDocumentRef;
  onSnapshot(
    next: (snapshot: FirestoreQuerySnapshot) => void,
    error: (error: unknown) => void,
  ): () => void;
};

type FirestoreTransaction = {
  get(ref: FirestoreDocumentRef): Promise<FirestoreDoc>;
  update(ref: FirestoreDocumentRef, data: Record<string, unknown>): void;
};

type FirestoreDb = {
  collection(path: string): FirestoreCollectionRef;
  runTransaction<T>(runner: (transaction: FirestoreTransaction) => Promise<T>): Promise<T>;
};

type FirebaseCompat = {
  apps: Array<{ name: string }>;
  initializeApp(config: Record<string, string>, name?: string): unknown;
  app(name?: string): unknown;
  firestore(app?: unknown): FirestoreDb;
};

let firestorePromise: Promise<FirestoreDb> | null = null;

const emptySnapshot = (): WorkspaceLiveSnapshot => ({
  clients: [],
  projects: [],
  tasks: [],
  receivables: [],
  opportunities: [],
  movements: [],
});

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

async function getFirestore() {
  if (firestorePromise) return firestorePromise;

  firestorePromise = (async () => {
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`,
    );
    await loadScript(
      `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore-compat.js`,
    );

    const firebase = (window as Window & { firebase?: FirebaseCompat }).firebase;
    if (!firebase) throw new Error("firebase-sdk-unavailable");

    const existingApp = firebase.apps.find((candidate) => candidate.name === APP_NAME);
    const app = existingApp
      ? firebase.app(APP_NAME)
      : firebase.initializeApp(XARCON_FIREBASE_CONFIG, APP_NAME);

    return firebase.firestore(app);
  })();

  return firestorePromise;
}

function collectionPath(name: string) {
  return `workspaces/${WORKSPACE_ID}/${name}`;
}

function cleanObject<T>(value: T): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function fromDocs<T extends { id: string }>(snapshot: FirestoreQuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() ?? {}) } as T));
}

function sortWorkspace(snapshot: WorkspaceLiveSnapshot): WorkspaceLiveSnapshot {
  return {
    clients: [...snapshot.clients].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)),
    projects: [...snapshot.projects].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    tasks: [...snapshot.tasks].sort((a, b) => a.deadline.localeCompare(b.deadline)),
    receivables: [...snapshot.receivables].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    opportunities: [...snapshot.opportunities].sort((a, b) => a.date.localeCompare(b.date)),
    movements: [...snapshot.movements].sort((a, b) => b.date.localeCompare(a.date)),
  };
}

const collectionKeys = {
  clients: "clients",
  projects: "projects",
  tasks: "tasks",
  receivables: "receivables",
  opportunities: "opportunities",
  movements: "financeMovements",
} as const;

export async function subscribeWorkspace(
  onData: (snapshot: WorkspaceLiveSnapshot, ready: boolean) => void,
  onError: (error: Error) => void,
) {
  const db = await getFirestore();
  const current = emptySnapshot();
  const readyKeys = new Set<keyof WorkspaceLiveSnapshot>();
  const unsubscribers: Array<() => void> = [];

  const attach = <K extends keyof WorkspaceLiveSnapshot>(key: K) => {
    const unsubscribe = db
      .collection(collectionPath(collectionKeys[key]))
      .onSnapshot(
        (snapshot) => {
          current[key] = fromDocs<WorkspaceLiveSnapshot[K][number]>(snapshot) as WorkspaceLiveSnapshot[K];
          readyKeys.add(key);
          onData(sortWorkspace(current), readyKeys.size === Object.keys(collectionKeys).length);
        },
        (cause) => {
          const error = cause instanceof Error ? cause : new Error("firestore-listener-error");
          onError(error);
        },
      );
    unsubscribers.push(unsubscribe);
  };

  (Object.keys(collectionKeys) as Array<keyof WorkspaceLiveSnapshot>).forEach(attach);

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

async function createRecord<T extends { id: string }>(
  collectionName: string,
  input: Omit<T, "id">,
): Promise<T> {
  const db = await getFirestore();
  const ref = db.collection(collectionPath(collectionName)).doc();
  const next = { ...input, id: ref.id } as T;
  await ref.set(cleanObject(input));
  return next;
}

export function createClient(input: Omit<Client, "id">) {
  return createRecord<Client>(collectionKeys.clients, input);
}

export function createProject(input: Omit<Project, "id">) {
  return createRecord<Project>(collectionKeys.projects, input);
}

export function createTask(input: Omit<Task, "id">) {
  return createRecord<Task>(collectionKeys.tasks, input);
}

export function createReceivable(input: Omit<Receivable, "id">) {
  return createRecord<Receivable>(collectionKeys.receivables, input);
}

export function createOpportunity(input: Omit<Opportunity, "id">) {
  return createRecord<Opportunity>(collectionKeys.opportunities, input);
}

export function createMovement(input: Omit<FinanceMovement, "id">) {
  return createRecord<FinanceMovement>(collectionKeys.movements, input);
}

export async function updateTaskStatus(id: string, status: Task["status"]) {
  const db = await getFirestore();
  await db.collection(collectionPath(collectionKeys.tasks)).doc(id).update({ status });
}

export async function updateOpportunityStage(id: string, stage: Opportunity["stage"]) {
  const db = await getFirestore();
  await db.collection(collectionPath(collectionKeys.opportunities)).doc(id).update({ stage });
}

export async function registerPayment(receivableId: string, amount: number, note = "Abono manual") {
  if (!Number.isFinite(amount) || amount <= 0) return;

  const db = await getFirestore();
  const ref = db.collection(collectionPath(collectionKeys.receivables)).doc(receivableId);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw new Error("receivable-not-found");

    const item = snapshot.data() as unknown as Receivable;
    const capped = Math.min(amount, Math.max(0, item.total - item.paid));
    const paid = item.paid + capped;
    const remaining = Math.max(0, item.total - paid);
    const payment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: capped,
      note,
    };

    transaction.update(ref, {
      paid,
      status: remaining === 0 ? "al día" : paid > 0 ? "parcialmente pagado" : "pendiente",
      payments: [...(item.payments ?? []), payment],
    });

    return payment;
  });
}
