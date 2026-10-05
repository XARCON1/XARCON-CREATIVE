import { useEffect, useMemo, useState } from "react";
import {
  opportunities as seedOpportunities,
  receivables as seedReceivables,
  tasks as seedTasks,
  type Opportunity,
  type Receivable,
  type Task,
} from "./data";

const STORAGE_KEY = "xarcon-admin-workspace-v1";

type WorkspaceSnapshot = {
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
};

function readSnapshot(): WorkspaceSnapshot {
  if (typeof window === "undefined") {
    return { tasks: seedTasks, receivables: seedReceivables, opportunities: seedOpportunities };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as WorkspaceSnapshot;
    if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.receivables) || !Array.isArray(parsed.opportunities)) {
      throw new Error("invalid");
    }
    return parsed;
  } catch {
    return { tasks: seedTasks, receivables: seedReceivables, opportunities: seedOpportunities };
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
      resetDemo() {
        setState({ tasks: seedTasks, receivables: seedReceivables, opportunities: seedOpportunities });
      },
    }),
    [],
  );

  return { ...state, ...api, savedAt };
}
