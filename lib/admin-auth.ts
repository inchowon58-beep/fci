import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "kkf_admin";

function secret() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

export function adminPasswordConfigured() {
  return Boolean(secret());
}

export function verifyAdminPassword(password: string) {
  const expected = secret();
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function makeAdminToken() {
  const s = secret();
  if (!s) return "";
  return createHmac("sha256", s).update("kkf-admin-session-v1").digest("hex");
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = makeAdminToken();
  if (!expected) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthed() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export { COOKIE as ADMIN_COOKIE };
