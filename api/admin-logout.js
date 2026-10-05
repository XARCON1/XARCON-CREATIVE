import { clearSessionCookie, noStore } from "../server/adminSession.js";

export default function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ authenticated: false });
}
