import type { DepartmentId } from "../departments";
import type { EnvironmentState } from "../engine";
export type CameraMode = "overview" | "orbit" | "department" | "follow" | "interior" | "cinema";
export type Quality = "auto" | "high" | "low" | "plan";
export type Selection = { id:DepartmentId; kind:"agent" | "office" | "station" };
export type SceneView = { mode:CameraMode; focus:DepartmentId; quality:Quality; selection:Selection | null; environment:EnvironmentState };
export type Direction = "forward" | "back" | "left" | "right";
export type SceneAPI = { update(view:SceneView):void; move(direction:Direction,pressed:boolean):void; dispose():void };
export const cameras: Record<CameraMode,string> = { overview:"Vista general", orbit:"Órbita libre", department:"Departamento", follow:"Seguir agente", interior:"Recorrido interior", cinema:"Cinematográfica" };
