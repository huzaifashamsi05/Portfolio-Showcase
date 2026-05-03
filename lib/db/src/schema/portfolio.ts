import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bioTable = pgTable("bio", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  tagline: text("tagline").notNull(),
  subtitle: text("subtitle").notNull(),
  about: text("about").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  availability: text("availability").notNull(),
  university: text("university").notNull(),
  department: text("department").notNull(),
});

export const insertBioSchema = createInsertSchema(bioTable).omit({ id: true });
export type InsertBio = z.infer<typeof insertBioSchema>;
export type Bio = typeof bioTable.$inferSelect;

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  percentage: integer("percentage").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techUsed: text("tech_used").notNull(),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  status: text("status").notNull().default("coming_soon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url"),
  verifyUrl: text("verify_url"),
});

export const insertCertificationSchema = createInsertSchema(certificationsTable).omit({ id: true });
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certificationsTable.$inferSelect;

export const socialTable = pgTable("social", {
  id: serial("id").primaryKey(),
  github: text("github").notNull(),
  linkedin: text("linkedin").notNull(),
  youtube: text("youtube").notNull(),
  twitter: text("twitter").notNull(),
  facebook: text("facebook").notNull(),
  instagram: text("instagram").notNull(),
  whatsapp: text("whatsapp").notNull(),
});

export const insertSocialSchema = createInsertSchema(socialTable).omit({ id: true });
export type InsertSocial = z.infer<typeof insertSocialSchema>;
export type Social = typeof socialTable.$inferSelect;

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true, isRead: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;

export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  pageViews: integer("page_views").notNull().default(0),
  cvDownloads: integer("cv_downloads").notNull().default(0),
});

export const adminTable = pgTable("admin", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const rateLimitTable = pgTable("rate_limit", {
  id: serial("id").primaryKey(),
  ip: text("ip").notNull(),
  count: integer("count").notNull().default(1),
  windowStart: timestamp("window_start").notNull().defaultNow(),
});
