import type { Client, FinanceMovement, Opportunity, Receivable, Task } from "./data";

export type ReturnTypeWorkspace = {
  clients: Client[];
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
  movements: FinanceMovement[];
  savedAt: Date | null;
  toggleTask: (id: string) => void;
  addPayment: (receivableId: string, amount: number, note?: string) => void;
  moveOpportunity: (id: string, stage: Opportunity["stage"]) => void;
  addClient: (input: Omit<Client, "id" | "joinedAt" | "billed" | "pending" | "notes">) => Client;
  addMovement: (input: Omit<FinanceMovement, "id">) => FinanceMovement;
  resetDemo: () => void;
};
