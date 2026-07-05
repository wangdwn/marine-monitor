// Local development server entry — NOT used by Vercel
import { app } from "./boot";
import { serve } from "@hono/node-server";
import { initDb } from "../db/index";

const port = parseInt(process.env.PORT || "3000");

initDb().then(() => {
  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`[marine-monitor] http://localhost:${info.port}`);
  });
});
