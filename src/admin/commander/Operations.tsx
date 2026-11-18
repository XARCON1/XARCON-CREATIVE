import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { ReturnTypeWorkspace } from "../workspaceTypes";
import { demo, departments, flow } from "./departments";
import { initialState, reduceOperation } from "./engine";

function useSimulation(workspace: ReturnTypeWorkspace) {
  const [engine, dispatch] = useReducer(reduceOperation, undefined, () => initialState(Date.now()));
  const [source, setSource] = useState<"demo" | "workspace">("demo");
  const [choice, chooseProject] = useState<string>(demo[0].id);
  const [objective, setObjective] = useState("");
  const projects = useMemo(() => source === "demo" ? demo : workspace.projects.map(p => ({ id:p.id, name:p.name, status:String(p.status) })), [source, workspace.projects]);
  const project = projects.find(p => p.id === choice) ?? projects[0];
  const { mission, paused, logs } = engine;
  const running = mission?.phase === "running";
  useEffect(() => {
    if (!running || paused) return;
    const update = () => dispatch({ type:"tick", now:Date.now() });
    const interval = window.setInterval(update, 300);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", update); };
  }, [running, paused]);
  const active = running ? flow[mission!.step] : undefined;
  const completed = mission?.step ?? 0;
  const busy = running || mission?.phase === "review";
  return {
    engine, mission, paused, busy, active, completed, logs, projects, source, project, projectId:project?.id ?? "", chooseProject, objective, setObjective,
    changeSource(value: "demo" | "workspace") { if (!busy) { setSource(value); chooseProject(value === "demo" ? demo[0].id : workspace.projects[0]?.id ?? ""); } },
    start() { if (project && objective.trim() && !busy) dispatch({ type:"start", project, objective, now:Date.now() }); },
    togglePause() { dispatch({ type:"pause", now:Date.now() }); },
    cancel() { dispatch({ type:"cancel", now:Date.now() }); },
    resolve(approved:boolean) { dispatch({ type:"resolve", approved, now:Date.now() }); },
    setSpeed(value:number) { dispatch({ type:"speed", value, now:Date.now() }); },
    signals:departments.map(d => ({ ...d, state:active === d.id ? paused ? "Pausado" : "Procesando" : flow.indexOf(d.id) < completed ? "Completado" : "Disponible" }))
  };
}
const Context = createContext<ReturnType<typeof useSimulation> | null>(null);
export function OperationsProvider({ workspace, children }: { workspace: ReturnTypeWorkspace; children: ReactNode }) {
  return <Context.Provider value={useSimulation(workspace)}>{children}</Context.Provider>;
}
export function useOperations() {
  const value = useContext(Context);
  if (!value) throw new Error("Commander requiere una sesión operativa");
  return value;
}
