import { isConfigured, noStore, readCookie, verifySession } from "../server/adminSession.js";

export default function handler(req, res) {
  noStore(res);
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  if (!isConfigured()) return res.status(503).json({ error: "admin_auth_unconfigured" });
  const authenticated = verifySession(readCookie(req));
  if (!authenticated) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, role: "Owner" });
}
