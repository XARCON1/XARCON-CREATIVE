import { useEffect, useMemo, useState } from "react";
import {
  clients as seedClients,
  movements as seedMovements,
  opportunities as seedOpportunities,
  receivables as seedReceivables,
  tasks as seedTasks,
  type Client,
  type FinanceMovement,
  type Opportunity,
  type Receivable,
  type Task,
} from "./data";

const STORAGE_KEY = "xarcon-admin-workspace-v2";

type WorkspaceSnapshot = {
  clients: Client[];
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
  movements: FinanceMovement[];
};

const seedSnapshot = (): WorkspaceSnapshot => ({
  clients: seedClients,
  tasks: seedTasks,
  receivables: seedReceivables,
  opportunities: seedOpportunities,
  movements: seedMovements,
});

function readSnapshot(): WorkspaceSnapshot {
  if (typeof window === "undefined") return seedSnapshot();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as WorkspaceSnapshot;
    if (
      !Array.isArray(parsed.clients) ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.receivables) ||
      !Array.isArray(parsed.opportunities) ||
      !Array.isArray(parsed.movements)
    ) {
      throw new Error("invalid");
    }
    return parsed;
  } catch {
    return seedSnapshot();
  }
}

export function useWorkspace() {
  const [state, setState] = useState<WorkspaceSnapshot>(readSnapshot);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSavedAt(new Date());
  }, [state]);

  const api = useMemo(
    () => ({
      toggleTask(id: string) {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === id
              ? { ...task, status: task.status === "Terminada" ? "Pendiente" : "Terminada" }
              : task,
          ),
        }));
      },
      addPayment(receivableId: string, amount: number, note = "Abono manual") {
        if (!Number.isFinite(amount) || amount <= 0) return;
        setState((current) => ({
          ...current,
          receivables: current.receivables.map((item) => {
            if (item.id !== receivableId) return item;
            const capped = Math.min(amount, Math.max(0, item.total - item.paid));
            const paid = item.paid + capped;
            const remaining = Math.max(0, item.total - paid);
            return {
              ...item,
              paid,
              status: remaining === 0 ? "al día" : paid > 0 ? "parcialmente pagado" : "pendiente",
              payments: [
                ...item.payments,
                {
                  id: `pay-${Date.now()}`,
                  date: new Date().toISOString().slice(0, 10),
                  amount: capped,
                  note,
                },
              ],
            };
          }),
        }));
      },
      moveOpportunity(id: string, stage: Opportunity["stage"]) {
        setState((current) => ({
          ...current,
          opportunities: current.opportunities.map((item) =>
            item.id === id ? { ...item, stage } : item,
          ),
        }));
      },
      addClient(input: Omit<Client, "id" | "joinedAt" | "billed" | "pending" | "notes">) {
        const next: Client = {
          ...input,
          id: `cli-${Date.now()}`,
          joinedAt: new Date().toISOString().slice(0, 10),
          billed: 0,
          pending: 0,
          notes: "Registro creado desde XARCON HQ demo.",
        };
        setState((current) => ({ ...current, clients: [next, ...current.clients] }));
        return next;
      },
      addMovement(input: Omit<FinanceMovement, "id">) {
        const next: FinanceMovement = { ...input, id: `mov-${Date.now()}` };
        setState((current) => ({ ...current, movements: [next, ...current.movements] }));
        return next;
      },
      resetDemo() {
        setState(seedSnapshot());
      },
    }),
    [],
  );

  return { ...state, ...api, savedAt };
}
