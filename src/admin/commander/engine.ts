import { department, flow, type DepartmentId } from "./departments";

export type Project = { id: string; name: string; status: string };
export type Task = { department: DepartmentId; label: string };
export type AgentState = "Disponible" | "Planificando" | "Ejecutando" | "Colaborando" | "Esperando información" | "En revisión" | "Esperando aprobación" | "Pausado" | "Completado" | "Error";
export type Agent = { department: DepartmentId; state: AgentState; task: Task; progress: number };
export type Approval = { approved: boolean; at: number };
export type Communication = { from: DepartmentId; to: DepartmentId };
export type ExecutionEvent = { id: number; time: string; agent: string; message: string; mode: "simulation" | "live"; handoff?: Communication };
export type Mission = { id: string; projectId: string; projectName: string; objective: string; step: number; elapsed: number; phase: "running" | "review" | "done"; approval?: Approval };
// A read-only execution adapter can publish this snapshot shape. The simulation
// adapter below is the only producer wired to the owner's Commander shell.
export interface ExecutionFeed {
  getSnapshot(): EnvironmentState;
  subscribe(listener: () => void): () => void;
}
export type EnvironmentState = { agents?: Partial<Record<DepartmentId,Agent>>; mission: Mission | null; paused: boolean; speed: number; logs: ExecutionEvent[]; sequence: number; clock: number };
export type Operation = { type: "start"; project: Project; objective: string; now: number }
  | { type: "tick" | "pause" | "cancel"; now: number }
  | { type: "resolve"; approved: boolean; now: number }
  | { type: "speed"; value: number; now: number };

// Timeline and graphics consume the same read model. A future authenticated feed
// can supply Agent and ExecutionEvent records without acquiring workspace writers.
export const STAGE_MS = 20000;
const displayTime = new Intl.DateTimeFormat("es-NI", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
function entry(state: EnvironmentState, at: number, agent: string, message: string, handoff?: Communication): EnvironmentState {
  const id = state.sequence + 1;
  const item: ExecutionEvent = { id, time: displayTime.format(at), agent, message, mode:"simulation", handoff };
  return { ...state, sequence: id, logs: [item, ...state.logs].slice(0, 80) };
}
export function initialState(now: number): EnvironmentState {
  return entry({ mission: null, paused: false, speed: 1, logs: [], sequence: 0, clock: now }, now, "COMMANDER", "Entorno de simulación inicializado");
}
function advance(state: EnvironmentState, now: number): EnvironmentState {
  if (!state.mission || state.paused || state.mission.phase !== "running" || now <= state.clock) return state;
  let mission = { ...state.mission };
  let elapsed = mission.elapsed + (now - state.clock) * state.speed;
  while (elapsed >= STAGE_MS && mission.step < flow.length) {
    elapsed -= STAGE_MS;
    const at = now - elapsed / state.speed;
    const previous = department(flow[mission.step]);
    const next = department(flow[mission.step + 1] ?? "command");
    state = entry(state, at, previous.agent, previous.actions[1] + " · entrega simulada", { from: previous.id, to: next.id });
    mission.step++;
    if (mission.step === flow.length) {
      mission.phase = "review";
      elapsed = 0;
      state = entry(state, at, "COMMANDER", "Misión preparada para revisión humana");
    } else {
      state = entry(state, at, next.agent, next.actions[0] + " · ejecución simulada");
    }
  }
  mission.elapsed = elapsed;
  return { ...state, mission, clock: now };
}
export function reduceOperation(previous: EnvironmentState, action: Operation): EnvironmentState {
  const now = action.now;
  const state = advance(previous, now);
  const m = state.mission;
  switch (action.type) {
    case "tick": return state;
    case "start": {
      if ((m && m.phase !== "done") || !action.objective.trim()) return state;
      const mission: Mission = { id: "SIM-" + now.toString(36).toUpperCase(), projectId: action.project.id, projectName: action.project.name, objective: action.objective.trim(), step: 0, elapsed: 0, phase: "running" };
      const assigned = entry({ ...state, mission, paused:false, clock:now }, now, "COMMANDER", "Misión asignada · " + action.project.name);
      return entry(assigned, now, "ATLAS", "Analizar solicitud · ejecución simulada");
    }
    case "pause":
      if (m?.phase !== "running") return state;
      return entry({ ...state, paused: !state.paused, clock:now }, now, "OWNER", state.paused ? "Misión reanudada" : "Misión pausada");
    case "cancel":
      if (m?.phase !== "running") return state;
      return entry({ ...state, mission:null, paused:false }, now, "OWNER", "Misión cancelada");
    case "resolve":
      if (m?.phase !== "review") return state;
      return entry({ ...state, mission: action.approved ? { ...m, phase:"done", approval:{ approved:true, at:now } } : null }, now, "OWNER", action.approved ? "Aprobación simulada registrada" : "Misión simulada rechazada");
    case "speed":
      return [1,2,4].includes(action.value) ? { ...state, speed: action.value, clock:now } : state;
  }
}
export function readAgent(id: DepartmentId, state: EnvironmentState): Agent {
  const measured = state.agents?.[id];
  if (measured) return measured;
  const m = state.mission;
  const d = department(id);
  const index = flow.indexOf(id);
  let status: AgentState = "Disponible", label = "En su departamento", progress = 0;
  if (m) {
    if (id === "command") {
      progress = (m.step + m.elapsed / STAGE_MS) / flow.length;
      status = m.phase === "done" ? "Completado" : m.phase === "review" ? "Esperando aprobación" : state.paused ? "Pausado" : "En revisión";
      label = m.phase === "review" ? d.actions[1] : m.phase === "done" ? "Aprobación registrada" : d.actions[0];
    } else if (index < m.step) {
      progress = 1; status = "Completado"; label = d.actions[1];
    } else if (index === m.step) {
      progress = m.elapsed / STAGE_MS;
      status = state.paused ? "Pausado" : progress < .15 ? "Planificando" : progress > .78 ? "Colaborando" : id === "quality" ? "En revisión" : "Ejecutando";
      label = progress < .55 ? d.actions[0] : d.actions[1];
    } else if (index === m.step + 1 && m.elapsed / STAGE_MS > .78) {
      status = state.paused ? "Pausado" : "Colaborando"; label = "Recibir entrega de " + department(flow[m.step]).agent;
    } else {
      status = "Esperando información"; label = "Pendiente de entrega";
    }
  }
  return { department:id, state:status, task:{department:id,label}, progress };
}
