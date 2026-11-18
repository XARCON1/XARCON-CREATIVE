import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { ReturnTypeWorkspace } from "../workspaceTypes";
import Commander from "./Commander";
import { OperationsProvider } from "./Operations";

const Entorno = lazy(() => import("./entorno/Entorno"));
export default function CommanderRoutes({ workspace }: { workspace: ReturnTypeWorkspace }) {
  return <OperationsProvider workspace={workspace}>
    <Suspense fallback={<div className="hq-auth-screen" role="status">Abriendo la sede…</div>}>
      <Routes>
        <Route path="/admin/commander" element={<Commander workspace={workspace}/>}/>
        <Route path="/admin/commander/entorno" element={<Entorno/>}/>
        <Route path="*" element={<Navigate to="/admin/commander" replace/>}/>
      </Routes>
    </Suspense>
  </OperationsProvider>;
}
