import type { Context as HonoContext } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const COOKIE_NAME = "marine_session";
const ADMIN_USER = { id: 1, unionId: "admin", name: "管理员", email: "admin@marine.cn", role: "admin" };

export async function createContext(c: HonoContext) {
  const session = getCookie(c, COOKIE_NAME);
  return {
    c,
    user: session ? ADMIN_USER : null,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
