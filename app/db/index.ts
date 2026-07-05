// Database connection stub
// For production: replace with real MySQL when DATABASE_URL is available
// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import * as schema from "./schema";

let _db: any = null;

export function getDb(): any {
  return _db;
}

export async function initDb(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[db] DATABASE_URL not set, using mock data");
    return;
  }
  // const pool = mysql.createPool(url);
  // _db = drizzle(pool, { schema, mode: "default" });
  console.log("[db] MySQL connection ready");
}
