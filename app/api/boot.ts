import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { appRouter } from "./router";
import { createContext } from "./context";
import { initDb } from "../db/index";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const app = new Hono();

app.use("/*", cors({ origin: true, credentials: true }));

// tRPC API — must come BEFORE static file serve
app.use("/api/trpc/*", trpcServer({ router: appRouter, createContext }));

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Serve static frontend
const distPath = join(import.meta.dirname, "..", "dist");
app.use("/assets/*", serveStatic({ root: distPath }));
app.get("/reports/*", serveStatic({ root: distPath }));
app.get("/favicon.ico", serveStatic({ root: distPath }));

// SPA fallback — only for non-API routes
app.get("*", async (c) => {
  try {
    const html = await readFile(join(distPath, "index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.text("App not built. Run: npm run build", 500);
  }
});

const port = parseInt(process.env.PORT || "3000");

initDb().then(() => {
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`[marine-monitor] Server running on http://localhost:${info.port}`);
  });
});
