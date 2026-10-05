import type { Opportunity, Receivable, Task } from "./data";

export type ReturnTypeWorkspace = {
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
  savedAt: Date | null;
  toggleTask: (id: string) => void;
  addPayment: (receivableId: string, amount: number, note?: string) => void;
  moveOpportunity: (id: string, stage: Opportunity["stage"]) => void;
  resetDemo: () => void;
};
