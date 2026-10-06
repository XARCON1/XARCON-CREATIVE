import { useEffect, useState } from "react";
import type {
  Client,
  CrmConversationStatus,
  FinanceMovement,
  Opportunity,
  Project,
  Receivable,
  Task,
} from "./data";
import {
  createClient,
  addConversationNote,
  createMovement,
  createOpportunity,
  createProject,
  createReceivable,
  createTask,
  markConversationRead,
  registerPayment,
  setConversationStatus,
  subscribeWorkspace,
  updateConversation,
  updateOpportunityStage,
  updateTaskStatus,
  type WorkspaceConnection,
  type WorkspaceLiveSnapshot,
} from "./firebaseWorkspace";

const emptySnapshot = (): WorkspaceLiveSnapshot => ({
  clients: [],
  projects: [],
  tasks: [],
  receivables: [],
  opportunities: [],
  movements: [],
  conversations: [],
  crmMessages: [],
});

export function useWorkspace(enabled: boolean) {
  const [state, setState] = useState<WorkspaceLiveSnapshot>(emptySnapshot);
  const [connection, setConnection] = useState<WorkspaceConnection>("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    if (!enabled) {
      setState(emptySnapshot());
      setConnection("idle");
      setError(null);
      return () => undefined;
    }

    setConnection("connecting");
    setError(null);

    void subscribeWorkspace(
      (snapshot, ready) => {
        if (!active) return;
        setState(snapshot);
        setSavedAt(new Date());
        setConnection(ready ? "live" : "connecting");
      },
      (cause) => {
        if (!active) return;
        setConnection("error");
        setError(cause.message || "No fue posible sincronizar Firestore.");
      },
    )
      .then((cleanup) => {
        if (!active) {
          cleanup();
          return;
        }
        unsubscribe = cleanup;
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setConnection("error");
        setError(cause instanceof Error ? cause.message : "No fue posible conectar Firestore.");
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [enabled]);

  const ensureEnabled = () => {
    if (!enabled) throw new Error("workspace-not-authenticated");
  };

  const api = {
    async markConversationRead(id: string) {
      ensureEnabled();
      await markConversationRead(id);
    },

    async setConversationStatus(id: string, status: CrmConversationStatus) {
      ensureEnabled();
      await setConversationStatus(id, status);
    },

    async linkConversationToClient(id: string, clientId: string) {
      ensureEnabled();
      await updateConversation(id, {
        clientId,
        updatedAt: new Date().toISOString(),
      });
    },

    async addConversationNote(conversationId: string, body: string, authorName: string) {
      ensureEnabled();
      if (!body.trim()) return;
      await addConversationNote(conversationId, body, authorName);
    },

    async toggleTask(id: string) {
      ensureEnabled();
      const task = state.tasks.find((item) => item.id === id);
      if (!task) return;
      const status: Task["status"] = task.status === "Terminada" ? "Pendiente" : "Terminada";
      await updateTaskStatus(id, status);
    },

    async addPayment(receivableId: string, amount: number, note = "Abono manual") {
      ensureEnabled();
      await registerPayment(receivableId, amount, note);
    },

    async moveOpportunity(id: string, stage: Opportunity["stage"]) {
      ensureEnabled();
      await updateOpportunityStage(id, stage);
    },

    async addClient(input: Omit<Client, "id" | "joinedAt" | "billed" | "pending" | "notes">) {
      ensureEnabled();
      return createClient({
        ...input,
        joinedAt: new Date().toISOString().slice(0, 10),
        billed: 0,
        pending: 0,
        notes: "Registro creado desde XARCON HQ.",
      });
    },

    async addProject(
      input: Omit<
        Project,
        "id" | "collaborators" | "advance" | "pending" | "startedAt"
      > & { advance?: number },
    ) {
      ensureEnabled();
      const advance = Math.max(0, input.advance ?? 0);
      return createProject({
        ...input,
        collaborators: [],
        advance,
        pending: Math.max(0, input.contracted - advance),
        startedAt: new Date().toISOString().slice(0, 10),
      });
    },

    async addTask(input: Omit<Task, "id">) {
      ensureEnabled();
      return createTask(input);
    },

    async addReceivable(input: Omit<Receivable, "id" | "status" | "payments">) {
      ensureEnabled();
      const remaining = Math.max(0, input.total - input.paid);
      const today = new Date().toISOString().slice(0, 10);
      const status: Receivable["status"] =
        remaining === 0
          ? "al día"
          : input.paid > 0
            ? "parcialmente pagado"
            : input.dueDate < today
              ? "vencido"
              : "pendiente";

      return createReceivable({
        ...input,
        status,
        payments:
          input.paid > 0
            ? [{
                id: `pay-${Date.now()}`,
                date: today,
                amount: input.paid,
                note: "Saldo inicial registrado",
              }]
            : [],
      });
    },

    async addOpportunity(input: Omit<Opportunity, "id">) {
      ensureEnabled();
      return createOpportunity(input);
    },

    async addMovement(input: Omit<FinanceMovement, "id">) {
      ensureEnabled();
      return createMovement(input);
    },
  };

  return {
    ...state,
    ...api,
    connection,
    error,
    savedAt,
  };
}
