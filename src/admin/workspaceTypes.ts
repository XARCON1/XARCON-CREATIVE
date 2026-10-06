import type {
  Client,
  FinanceMovement,
  Opportunity,
  Project,
  Receivable,
  Task,
} from "./data";
import type { WorkspaceConnection } from "./firebaseWorkspace";

export type ReturnTypeWorkspace = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  receivables: Receivable[];
  opportunities: Opportunity[];
  movements: FinanceMovement[];
  connection: WorkspaceConnection;
  error: string | null;
  savedAt: Date | null;
  toggleTask: (id: string) => Promise<void>;
  addPayment: (receivableId: string, amount: number, note?: string) => Promise<void>;
  moveOpportunity: (id: string, stage: Opportunity["stage"]) => Promise<void>;
  addClient: (
    input: Omit<Client, "id" | "joinedAt" | "billed" | "pending" | "notes">,
  ) => Promise<Client>;
  addProject: (
    input: Omit<Project, "id" | "collaborators" | "advance" | "pending" | "startedAt"> & {
      advance?: number;
    },
  ) => Promise<Project>;
  addTask: (input: Omit<Task, "id">) => Promise<Task>;
  addReceivable: (
    input: Omit<Receivable, "id" | "status" | "payments">,
  ) => Promise<Receivable>;
  addOpportunity: (input: Omit<Opportunity, "id">) => Promise<Opportunity>;
  addMovement: (input: Omit<FinanceMovement, "id">) => Promise<FinanceMovement>;
};
