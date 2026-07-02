import { Router } from "express";
import { db } from "@workspace/db";
import {
  bioTable,
  skillsTable,
  projectsTable,
  certificationsTable,
  socialTable,
  analyticsTable,
  messagesTable,
  rateLimitTable,
  testimonialsTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  SubmitContactBody,
  AdminLoginBody,
  AdminDeleteMessageParams,
  AdminMarkMessageReadParams,
  AdminCreateProjectBody,
  AdminUpdateProjectParams,
  AdminUpdateProjectBody,
  AdminDeleteProjectParams,
  AdminCreateSkillBody,
  AdminUpdateSkillParams,
  AdminUpdateSkillBody,
  AdminDeleteSkillParams,
  AdminCreateCertificationBody,
  AdminUpdateCertificationParams,
  AdminUpdateCertificationBody,
  AdminDeleteCertificationParams,
  AdminUpdateSocialBody,
  AdminUpdateBioBody,
  AdminCreateTestimonialBody,
  AdminUpdateTestimonialParams,
  AdminUpdateTestimonialBody,
  AdminDeleteTestimonialParams,
} from "@workspace/api-zod";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "portfolio-secret-key";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "huzaifa";
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || "admin123").digest("hex");

function verifyAdmin(req: import("express").Request): boolean {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// ========================
// PUBLIC ROUTES
// ========================

router.get("/bio", async (req, res) => {
  try {
    const [bio] = await db.select().from(bioTable).limit(1);
    if (!bio) return res.status(404).json({ error: "Bio not found" });
    return res.json(bio);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/skills", async (req, res) => {
  try {
    const skills = await db.select().from(skillsTable).orderBy(skillsTable.sortOrder);
    return res.json(skills);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable);
    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/certifications", async (req, res) => {
  try {
    const certs = await db.select().from(certificationsTable);
    return res.json(certs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/social", async (req, res) => {
  try {
    const [social] = await db.select().from(socialTable).limit(1);
    if (!social) return res.status(404).json({ error: "Social not found" });
    return res.json(social);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const [analytics] = await db.select().from(analyticsTable).limit(1);
    const [{ totalMessages }] = await db
      .select({ totalMessages: sql<number>`count(*)` })
      .from(messagesTable);
    const [{ unreadMessages }] = await db
      .select({ unreadMessages: sql<number>`count(*)` })
      .from(messagesTable)
      .where(eq(messagesTable.isRead, false));

    return res.json({
      pageViews: analytics?.pageViews ?? 0,
      cvDownloads: analytics?.cvDownloads ?? 0,
      totalMessages: Number(totalMessages),
      unreadMessages: Number(unreadMessages),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// ANALYTICS TRACKING
// ========================

router.post("/analytics/pageview", async (req, res) => {
  try {
    const [existing] = await db.select().from(analyticsTable).limit(1);
    if (existing) {
      await db
        .update(analyticsTable)
        .set({ pageViews: existing.pageViews + 1 })
        .where(eq(analyticsTable.id, existing.id));
    } else {
      await db.insert(analyticsTable).values({ pageViews: 1, cvDownloads: 0 });
    }
    return res.json({ success: true, message: "Tracked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/analytics/cvdownload", async (req, res) => {
  try {
    const [existing] = await db.select().from(analyticsTable).limit(1);
    if (existing) {
      await db
        .update(analyticsTable)
        .set({ cvDownloads: existing.cvDownloads + 1 })
        .where(eq(analyticsTable.id, existing.id));
    } else {
      await db.insert(analyticsTable).values({ pageViews: 0, cvDownloads: 1 });
    }
    return res.json({ success: true, message: "Tracked" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// CONTACT FORM
// ========================

router.post("/contact", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const { name, email, message, honeypot } = parsed.data;

    // Honeypot spam check
    if (honeypot) {
      return res.json({ success: true, message: "Message sent!" });
    }

    // Rate limit: max 3 per IP per hour
    const ip = req.ip ?? "unknown";
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [existing] = await db
      .select()
      .from(rateLimitTable)
      .where(eq(rateLimitTable.ip, ip))
      .limit(1);

    if (existing) {
      if (existing.windowStart > oneHourAgo && existing.count >= 3) {
        return res.status(429).json({ error: "Too many submissions. Please try again later." });
      }
      if (existing.windowStart <= oneHourAgo) {
        await db
          .update(rateLimitTable)
          .set({ count: 1, windowStart: new Date() })
          .where(eq(rateLimitTable.ip, ip));
      } else {
        await db
          .update(rateLimitTable)
          .set({ count: existing.count + 1 })
          .where(eq(rateLimitTable.ip, ip));
      }
    } else {
      await db.insert(rateLimitTable).values({ ip, count: 1, windowStart: new Date() });
    }

    // Save to DB
    await db.insert(messagesTable).values({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      isRead: false,
    });

    return res.json({ success: true, message: "Message sent! I'll get back to you soon." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// ADMIN AUTH
// ========================

router.post("/admin/login", async (req, res) => {
  try {
    const parsed = AdminLoginBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const username = parsed.data.username.trim();
    const password = parsed.data.password.trim();
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    if (username !== ADMIN_USERNAME || passwordHash !== ADMIN_PASSWORD_HASH) {
      return res.status(401).json({ 
        error: "Invalid credentials",
        debug: {
          inputUsername: username,
          expectedUsername: ADMIN_USERNAME,
          inputHash: passwordHash,
          expectedHash: ADMIN_PASSWORD_HASH
        }
      });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/logout", (_req, res) => {
  return res.json({ success: true, message: "Logged out" });
});

router.get("/admin/me", (req, res) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const auth = req.headers.authorization!;
  const decoded = jwt.decode(auth.slice(7)) as { username: string };
  return res.json({ authenticated: true, username: decoded.username });
});

// ========================
// ADMIN MESSAGES
// ========================

router.get("/admin/messages", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  return db
    .select()
    .from(messagesTable)
    .orderBy(messagesTable.createdAt)
    .then((messages) => res.json(messages))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.delete("/admin/messages/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminDeleteMessageParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .delete(messagesTable)
    .where(eq(messagesTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Deleted" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.patch("/admin/messages/:id/read", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminMarkMessageReadParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .update(messagesTable)
    .set({ isRead: true })
    .where(eq(messagesTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Marked read" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// ADMIN PROJECTS
// ========================

router.post("/admin/projects", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminCreateProjectBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .insert(projectsTable)
    .values(parsed.data)
    .returning()
    .then(([project]) => res.status(201).json(project))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.put("/admin/projects/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const params = AdminUpdateProjectParams.safeParse({ id: Number(req.params.id) });
  const body = AdminUpdateProjectBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .update(projectsTable)
    .set(body.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning()
    .then(([project]) => res.json(project))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.delete("/admin/projects/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminDeleteProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .delete(projectsTable)
    .where(eq(projectsTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Deleted" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// ADMIN SKILLS
// ========================

router.post("/admin/skills", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminCreateSkillBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .insert(skillsTable)
    .values(parsed.data)
    .returning()
    .then(([skill]) => res.status(201).json(skill))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.put("/admin/skills/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const params = AdminUpdateSkillParams.safeParse({ id: Number(req.params.id) });
  const body = AdminUpdateSkillBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .update(skillsTable)
    .set(body.data)
    .where(eq(skillsTable.id, params.data.id))
    .returning()
    .then(([skill]) => res.json(skill))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.delete("/admin/skills/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminDeleteSkillParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .delete(skillsTable)
    .where(eq(skillsTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Deleted" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// ADMIN CERTIFICATIONS
// ========================

router.post("/admin/certifications", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminCreateCertificationBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .insert(certificationsTable)
    .values(parsed.data)
    .returning()
    .then(([cert]) => res.status(201).json(cert))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.put("/admin/certifications/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const params = AdminUpdateCertificationParams.safeParse({ id: Number(req.params.id) });
  const body = AdminUpdateCertificationBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .update(certificationsTable)
    .set(body.data)
    .where(eq(certificationsTable.id, params.data.id))
    .returning()
    .then(([cert]) => res.json(cert))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.delete("/admin/certifications/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminDeleteCertificationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .delete(certificationsTable)
    .where(eq(certificationsTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Deleted" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// ADMIN SOCIAL
// ========================

router.put("/admin/social", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminUpdateSocialBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .select()
    .from(socialTable)
    .limit(1)
    .then(([existing]) => {
      if (existing) {
        return db.update(socialTable).set(parsed.data).where(eq(socialTable.id, existing.id)).returning();
      }
      return db.insert(socialTable).values(parsed.data).returning();
    })
    .then(([social]) => res.json(social))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// ADMIN BIO
// ========================

router.put("/admin/bio", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminUpdateBioBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .select()
    .from(bioTable)
    .limit(1)
    .then(([existing]) => {
      if (existing) {
        return db.update(bioTable).set(parsed.data).where(eq(bioTable.id, existing.id)).returning();
      }
      return Promise.reject(new Error("Bio not found"));
    })
    .then(([bio]) => res.json(bio))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

// ========================
// TESTIMONIALS (PUBLIC)
// ========================

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await db.select().from(testimonialsTable).orderBy(testimonialsTable.sortOrder);
    return res.json(testimonials);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// ADMIN TESTIMONIALS
// ========================

router.post("/admin/testimonials", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminCreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .insert(testimonialsTable)
    .values(parsed.data)
    .returning()
    .then(([t]) => res.status(201).json(t))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.put("/admin/testimonials/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const params = AdminUpdateTestimonialParams.safeParse({ id: Number(req.params.id) });
  const body = AdminUpdateTestimonialBody.safeParse(req.body);
  if (!params.success || !body.success) return res.status(400).json({ error: "Invalid input" });
  return db
    .update(testimonialsTable)
    .set(body.data)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning()
    .then(([t]) => res.json(t))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

router.delete("/admin/testimonials/:id", (req, res) => {
  if (!verifyAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  const parsed = AdminDeleteTestimonialParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) return res.status(400).json({ error: "Invalid id" });
  return db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, parsed.data.id))
    .then(() => res.json({ success: true, message: "Deleted" }))
    .catch((err) => { console.error(err); res.status(500).json({ error: "Internal server error" }); });
});

export default router;
