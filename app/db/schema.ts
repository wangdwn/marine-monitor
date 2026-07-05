import { mysqlTable, varchar, text, int, timestamp, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  unionId: varchar("union_id", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 64 }),
  email: varchar("email", { length: 128 }),
  avatar: varchar("avatar", { length: 512 }),
  role: varchar("role", { length: 32 }).default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = mysqlTable("reports", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 256 }).notNull(),
  category: varchar("category", { length: 64 }),
  summary: text("summary"),
  coverUrl: varchar("cover_url", { length: 512 }),
  fileUrl: varchar("file_url", { length: 512 }),
  views: int("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const policies = mysqlTable("policies", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 256 }).notNull(),
  source: varchar("source", { length: 128 }),
  level: varchar("level", { length: 32 }),
  date: varchar("date", { length: 32 }),
  content: text("content"),
  category: varchar("category", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weeklyData = mysqlTable("weekly_data", {
  id: int("id").primaryKey().autoincrement(),
  issue: varchar("issue", { length: 32 }),
  date: varchar("date", { length: 32 }),
  tracks: json("tracks"),
  createdAt: timestamp("created_at").defaultNow(),
});
