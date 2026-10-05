import crypto from "node:crypto";

export const COOKIE_NAME = "xarcon_hq_session";
const WEEK = 60 * 60 * 24 * 7;

function secret() {
  return process.env.XARCON_ADMIN_SESSION_SECRET || "";
}

export function isConfigured() {
  return Boolean(process.env.XARCON_ADMIN_ACCESS_KEY && secret());
}

export function sameSecret(candidate = "") {
  const configured = process.env.XARCON_ADMIN_ACCESS_KEY || "";
  const a = crypto.createHash("sha256").update(String(candidate)).digest();
  const b = crypto.createHash("sha256").update(configured).digest();
  return configured.length > 0 && crypto.timingSafeEqual(a, b);
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSession() {
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(12).toString("base64url");
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token = "") {
  if (!secret()) return false;
  const parts = String(token).split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, nonce, signature] = parts;
  const payload = `${issuedAt}.${nonce}`;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return false;
  const age = Math.floor(Date.now() / 1000) - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= WEEK;
}

export function readCookie(req) {
  const header = req.headers?.cookie || "";
  const item = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return item ? decodeURIComponent(item.slice(COOKIE_NAME.length + 1)) : "";
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${WEEK}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
}
