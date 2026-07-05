import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const ADMIN_USER = { id: 1, unionId: "admin", name: "管理员", email: "admin@marine.cn", role: "admin", avatar: "" };
const COOKIE_NAME = "marine_session";

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) return null;
    return ctx.user;
  }),
  login: publicProcedure
    .input(z.object({ email: z.string().optional(), password: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      setCookie(ctx.c, COOKIE_NAME, "admin_session_token", {
        httpOnly: true, path: "/", maxAge: 86400 * 7, sameSite: "lax",
      });
      return ADMIN_USER;
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    deleteCookie(ctx.c, COOKIE_NAME, { path: "/" });
    return { success: true };
  }),
});
