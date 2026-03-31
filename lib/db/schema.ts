import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Tracks anonymous usage per IP address for the 2-free-uses gate.
 * RLS: public INSERT (increment) and SELECT by IP are allowed via Supabase policy.
 * No user data is stored here.
 */
export const ipUsage = pgTable("ip_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipAddress: text("ip_address").notNull().unique(),
  useCount: integer("use_count").notNull().default(1),
  firstUsedAt: timestamp("first_used_at", { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }).defaultNow().notNull()
});

/**
 * Stores evaluation metadata per authenticated user.
 * NO resume content or job description text is saved here — only scores and metadata.
 * user_id references auth.users(id) — enforced via Supabase RLS, not FK constraint.
 * RLS: users can only SELECT/INSERT their own rows.
 */
export const userEvaluations = pgTable("user_evaluations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  jobTitle: text("job_title"),
  overallScore: integer("overall_score").notNull(),
  breakdown: jsonb("breakdown").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  missingKeywords: text("missing_keywords").array().notNull().default([]),
  matchedSkills: text("matched_skills").array().notNull().default([]),
  mode: text("mode").notNull().default("analysis"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
