import { createSession, isConfigured, noStore, sameSecret, sessionCookie } from "../server/adminSession.js";

export default function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!isConfigured()) return res.status(503).json({ error: "admin_auth_unconfigured" });

  let body = req.body || {};
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!sameSecret(body.accessKey)) return res.status(401).json({ error: "invalid_credentials" });

  res.setHeader("Set-Cookie", sessionCookie(createSession()));
  return res.status(200).json({ authenticated: true });
}
