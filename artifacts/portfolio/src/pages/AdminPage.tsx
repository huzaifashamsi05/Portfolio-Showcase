import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  useAdminMe, useAdminLogin, useAdminLogout,
  useAdminGetMessages, useAdminDeleteMessage, useAdminMarkMessageRead,
  useGetProjects, useAdminCreateProject, useAdminUpdateProject, useAdminDeleteProject,
  useGetSkills, useAdminCreateSkill, useAdminUpdateSkill, useAdminDeleteSkill,
  useGetCertifications, useAdminCreateCertification, useAdminUpdateCertification, useAdminDeleteCertification,
  useGetSocial, useAdminUpdateSocial,
  useGetBio, useAdminUpdateBio,
  useGetAnalytics,
  useGetTestimonials, useAdminCreateTestimonial, useAdminUpdateTestimonial, useAdminDeleteTestimonial,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { setToken, removeToken, getToken, getAuthHeaders } from "@/lib/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Section = "dashboard" | "messages" | "projects" | "skills" | "certifications" | "social" | "bio" | "analytics" | "testimonials";

const SIDEBAR_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "messages", label: "Messages", icon: "✉" },
  { id: "projects", label: "Projects", icon: "◈" },
  { id: "skills", label: "Skills", icon: "◎" },
  { id: "certifications", label: "Certifications", icon: "★" },
  { id: "testimonials", label: "Testimonials", icon: "❝" },
  { id: "social", label: "Social Links", icon: "⊕" },
  { id: "bio", label: "Bio Editor", icon: "✎" },
  { id: "analytics", label: "Analytics", icon: "◉" },
];

function AdminInput({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
        style={{ background: "#0d1a2e", border: "1px solid #1e293b", color: "#e2e8f0", fontFamily: "Space Grotesk, sans-serif" }}
        onFocus={(e) => (e.target.style.borderColor = "#00f5ff66")}
        onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
      />
    </div>
  );
}

function AdminTextarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="mb-3">
      <label className="block text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none"
        style={{ background: "#0d1a2e", border: "1px solid #1e293b", color: "#e2e8f0", fontFamily: "Space Grotesk, sans-serif" }}
        onFocus={(e) => (e.target.style.borderColor = "#00f5ff66")}
        onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
      />
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", disabled = false }: { onClick?: () => void; children: React.ReactNode; variant?: "primary" | "danger" | "ghost"; disabled?: boolean }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: "linear-gradient(135deg, #00f5ff, #0891b2)", color: "#080c18", fontWeight: 700 },
    danger: { background: "#7f1d1d", border: "1px solid #ef444444", color: "#fca5a5" },
    ghost: { background: "#1e293b", border: "1px solid #334155", color: "#94a3b8" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg text-xs transition-all duration-200"
      style={{ ...styles[variant], cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, fontFamily: "Space Grotesk, sans-serif" }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, color = "#00f5ff" }: { label: string; value: number; color?: string }) {
  return (
    <div className="p-6 rounded-xl" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
      <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Orbitron, sans-serif", color, textShadow: `0 0 20px ${color}66` }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "#64748b" }}>{label}</div>
    </div>
  );
}

// ===== SECTION COMPONENTS =====

function DashboardSection() {
  const { data: analytics } = useGetAnalytics({ request: { headers: getAuthHeaders() } } as any);
  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Page Views" value={analytics?.pageViews ?? 0} color="#00f5ff" />
        <StatCard label="CV Downloads" value={analytics?.cvDownloads ?? 0} color="#8b5cf6" />
        <StatCard label="Total Messages" value={analytics?.totalMessages ?? 0} color="#22c55e" />
        <StatCard label="Unread Messages" value={analytics?.unreadMessages ?? 0} color="#f59e0b" />
      </div>
    </div>
  );
}

function MessagesSection() {
  const { data: messages, refetch } = useAdminGetMessages({ request: { headers: getAuthHeaders() } } as any);
  const deleteMutation = useAdminDeleteMessage();
  const markReadMutation = useAdminMarkMessageRead();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMutation.mutateAsync({ id } as any);
      toast.success("Message deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markReadMutation.mutateAsync({ id } as any);
      refetch();
    } catch { toast.error("Failed to mark as read"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>
        Messages {messages && <span className="text-sm ml-2" style={{ color: "#f59e0b" }}>({messages.filter((m) => !m.isRead).length} unread)</span>}
      </h2>
      <div className="space-y-3">
        {messages?.map((msg) => (
          <div key={msg.id} className="p-4 rounded-xl" style={{ background: "#0d1426", border: `1px solid ${msg.isRead ? "#1e293b" : "#00f5ff22"}`, opacity: msg.isRead ? 0.7 : 1 }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>{msg.name}</span>
                <span className="text-xs ml-2" style={{ color: "#64748b" }}>{msg.email}</span>
                {!msg.isRead && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44" }}>Unread</span>}
              </div>
              <span className="text-xs" style={{ color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>{msg.message}</p>
            <div className="flex gap-2">
              {!msg.isRead && <Btn onClick={() => handleMarkRead(msg.id)} variant="ghost">Mark Read</Btn>}
              <Btn onClick={() => handleDelete(msg.id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && <p className="text-sm" style={{ color: "#475569" }}>No messages yet.</p>}
      </div>
    </div>
  );
}

function ProjectsSection() {
  const { data: projects, refetch } = useGetProjects();
  const createMutation = useAdminCreateProject();
  const updateMutation = useAdminUpdateProject();
  const deleteMutation = useAdminDeleteProject();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", techUsed: "", liveUrl: "", githubUrl: "", status: "coming_soon" as "live" | "in_progress" | "coming_soon" });

  const resetForm = () => { setForm({ title: "", description: "", techUsed: "", liveUrl: "", githubUrl: "", status: "coming_soon" }); setEditing(null); };

  const handleSave = async () => {
    const data = { title: form.title, description: form.description, techUsed: form.techUsed, liveUrl: form.liveUrl || null, githubUrl: form.githubUrl || null, status: form.status };
    try {
      if (editing !== null) {
        await updateMutation.mutateAsync({ id: editing, data } as any);
        toast.success("Project updated");
      } else {
        await createMutation.mutateAsync({ data } as any);
        toast.success("Project created");
      }
      resetForm();
      refetch();
    } catch { toast.error("Failed to save"); }
  };

  const startEdit = (p: any) => {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description, techUsed: p.techUsed, liveUrl: p.liveUrl ?? "", githubUrl: p.githubUrl ?? "", status: p.status });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteMutation.mutateAsync({ id } as any);
      toast.success("Deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Projects</h2>
      <div className="p-5 rounded-xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#00f5ff" }}>{editing !== null ? "Edit Project" : "Add Project"}</h3>
        <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
        <AdminInput label="Tech Used (comma separated)" value={form.techUsed} onChange={(v) => setForm({ ...form, techUsed: v })} />
        <AdminInput label="Live URL (optional)" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} />
        <AdminInput label="GitHub URL (optional)" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} />
        <div className="mb-3">
          <label className="block text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#0d1a2e", border: "1px solid #1e293b", color: "#e2e8f0", fontFamily: "Space Grotesk, sans-serif" }}
          >
            <option value="live">Live</option>
            <option value="in_progress">In Progress</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Btn onClick={handleSave}>{editing !== null ? "Update" : "Add"}</Btn>
          {editing !== null && <Btn onClick={resetForm} variant="ghost">Cancel</Btn>}
        </div>
      </div>
      <div className="space-y-3">
        {projects?.map((p) => (
          <div key={p.id} className="p-4 rounded-xl flex justify-between items-center" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
            <div>
              <div className="font-semibold text-sm">{p.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{p.status} · {p.techUsed}</div>
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => startEdit(p)} variant="ghost">Edit</Btn>
              <Btn onClick={() => handleDelete(p.id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection() {
  const { data: skills, refetch } = useGetSkills();
  const createMutation = useAdminCreateSkill();
  const updateMutation = useAdminUpdateSkill();
  const deleteMutation = useAdminDeleteSkill();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "Frontend", percentage: "70", sortOrder: "0" });

  const resetForm = () => { setForm({ name: "", category: "Frontend", percentage: "70", sortOrder: "0" }); setEditing(null); };

  const handleSave = async () => {
    const data = { name: form.name, category: form.category, percentage: Number(form.percentage), sortOrder: Number(form.sortOrder) };
    try {
      if (editing !== null) {
        await updateMutation.mutateAsync({ id: editing, data } as any);
        toast.success("Skill updated");
      } else {
        await createMutation.mutateAsync({ data } as any);
        toast.success("Skill added");
      }
      resetForm();
      refetch();
    } catch { toast.error("Failed to save"); }
  };

  const startEdit = (s: any) => {
    setEditing(s.id);
    setForm({ name: s.name, category: s.category, percentage: String(s.percentage), sortOrder: String(s.sortOrder) });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteMutation.mutateAsync({ id } as any);
      toast.success("Deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Skills</h2>
      <div className="p-5 rounded-xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#00f5ff" }}>{editing !== null ? "Edit Skill" : "Add Skill"}</h3>
        <AdminInput label="Skill Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <AdminInput label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Frontend, Programming Languages, Other" />
        <AdminInput label="Percentage (0-100)" value={form.percentage} onChange={(v) => setForm({ ...form, percentage: v })} type="number" />
        <AdminInput label="Sort Order" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} type="number" />
        <div className="flex gap-2">
          <Btn onClick={handleSave}>{editing !== null ? "Update" : "Add"}</Btn>
          {editing !== null && <Btn onClick={resetForm} variant="ghost">Cancel</Btn>}
        </div>
      </div>
      <div className="space-y-2">
        {skills?.map((s) => (
          <div key={s.id} className="p-4 rounded-xl flex justify-between items-center" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
            <div>
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="text-xs ml-2" style={{ color: "#64748b" }}>{s.category} · {s.percentage}%</span>
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => startEdit(s)} variant="ghost">Edit</Btn>
              <Btn onClick={() => handleDelete(s.id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsSection() {
  const { data: certifications, refetch } = useGetCertifications();
  const createMutation = useAdminCreateCertification();
  const updateMutation = useAdminUpdateCertification();
  const deleteMutation = useAdminDeleteCertification();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", organization: "", date: "", imageUrl: "", verifyUrl: "" });

  const resetForm = () => { setForm({ title: "", organization: "", date: "", imageUrl: "", verifyUrl: "" }); setEditing(null); };

  const handleSave = async () => {
    const data = { title: form.title, organization: form.organization, date: form.date, imageUrl: form.imageUrl || null, verifyUrl: form.verifyUrl || null };
    try {
      if (editing !== null) {
        await updateMutation.mutateAsync({ id: editing, data } as any);
        toast.success("Updated");
      } else {
        await createMutation.mutateAsync({ data } as any);
        toast.success("Added");
      }
      resetForm();
      refetch();
    } catch { toast.error("Failed to save"); }
  };

  const startEdit = (c: any) => {
    setEditing(c.id);
    setForm({ title: c.title, organization: c.organization, date: c.date, imageUrl: c.imageUrl ?? "", verifyUrl: c.verifyUrl ?? "" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteMutation.mutateAsync({ id } as any);
      toast.success("Deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Certifications</h2>
      <div className="p-5 rounded-xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#00f5ff" }}>{editing !== null ? "Edit" : "Add"} Certification</h3>
        <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <AdminInput label="Organization" value={form.organization} onChange={(v) => setForm({ ...form, organization: v })} />
        <AdminInput label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="e.g. 11 November 2025" />
        <AdminInput label="Image URL (optional)" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
        <AdminInput label="Verify URL (optional)" value={form.verifyUrl} onChange={(v) => setForm({ ...form, verifyUrl: v })} />
        <div className="flex gap-2">
          <Btn onClick={handleSave}>{editing !== null ? "Update" : "Add"}</Btn>
          {editing !== null && <Btn onClick={resetForm} variant="ghost">Cancel</Btn>}
        </div>
      </div>
      <div className="space-y-2">
        {certifications?.map((c) => (
          <div key={c.id} className="p-4 rounded-xl flex justify-between items-center" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
            <div>
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{c.organization} · {c.date}</div>
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => startEdit(c)} variant="ghost">Edit</Btn>
              <Btn onClick={() => handleDelete(c.id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialSection() {
  const { data: social, refetch } = useGetSocial();
  const updateMutation = useAdminUpdateSocial();
  const [form, setForm] = useState({ github: "", linkedin: "", youtube: "", twitter: "", facebook: "", instagram: "", whatsapp: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (social && !loaded) {
      setForm({ github: social.github, linkedin: social.linkedin, youtube: social.youtube, twitter: social.twitter, facebook: social.facebook, instagram: social.instagram, whatsapp: social.whatsapp });
      setLoaded(true);
    }
  }, [social, loaded]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ data: form } as any);
      toast.success("Social links updated");
      refetch();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Social Links</h2>
      <div className="p-5 rounded-xl" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        {Object.keys(form).map((key) => (
          <AdminInput key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={(form as any)[key]} onChange={(v) => setForm({ ...form, [key]: v })} />
        ))}
        <Btn onClick={handleSave}>Save Changes</Btn>
      </div>
    </div>
  );
}

function BioSection() {
  const { data: bio, refetch } = useGetBio();
  const updateMutation = useAdminUpdateBio();
  const [form, setForm] = useState({ tagline: "", subtitle: "", about: "", availability: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (bio && !loaded) {
      setForm({ tagline: bio.tagline, subtitle: bio.subtitle, about: bio.about, availability: bio.availability });
      setLoaded(true);
    }
  }, [bio, loaded]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ data: form } as any);
      toast.success("Bio updated");
      refetch();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Bio Editor</h2>
      <div className="p-5 rounded-xl" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <AdminInput label="Tagline (pipe-separated roles)" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
        <AdminTextarea label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} rows={2} />
        <AdminTextarea label="About Me" value={form.about} onChange={(v) => setForm({ ...form, about: v })} rows={5} />
        <AdminInput label="Availability Status" value={form.availability} onChange={(v) => setForm({ ...form, availability: v })} />
        <Btn onClick={handleSave}>Save Changes</Btn>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const { data: testimonials, refetch } = useGetTestimonials();
  const createMutation = useAdminCreateTestimonial();
  const updateMutation = useAdminUpdateTestimonial();
  const deleteMutation = useAdminDeleteTestimonial();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: "5", sortOrder: "0" });

  const resetForm = () => { setForm({ name: "", role: "", quote: "", rating: "5", sortOrder: "0" }); setEditing(null); };

  const handleSave = async () => {
    const data = { name: form.name, role: form.role, quote: form.quote, rating: Number(form.rating), sortOrder: Number(form.sortOrder) };
    try {
      if (editing !== null) {
        await updateMutation.mutateAsync({ id: editing, data } as any);
        toast.success("Testimonial updated");
      } else {
        await createMutation.mutateAsync({ data } as any);
        toast.success("Testimonial added");
      }
      resetForm();
      refetch();
    } catch { toast.error("Failed to save"); }
  };

  const startEdit = (t: any) => {
    setEditing(t.id);
    setForm({ name: t.name, role: t.role, quote: t.quote, rating: String(t.rating), sortOrder: String(t.sortOrder) });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteMutation.mutateAsync({ id } as any);
      toast.success("Deleted");
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Testimonials</h2>
      <div className="p-5 rounded-xl mb-6" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#00f5ff" }}>{editing !== null ? "Edit" : "Add"} Testimonial</h3>
        <AdminInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Dr. Sarah Ahmed" />
        <AdminInput label="Role / Position" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="e.g. University Supervisor" />
        <AdminTextarea label="Quote" value={form.quote} onChange={(v) => setForm({ ...form, quote: v })} rows={3} />
        <AdminInput label="Rating (1–5)" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} type="number" />
        <AdminInput label="Sort Order" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} type="number" />
        <div className="flex gap-2">
          <Btn onClick={handleSave}>{editing !== null ? "Update" : "Add"}</Btn>
          {editing !== null && <Btn onClick={resetForm} variant="ghost">Cancel</Btn>}
        </div>
      </div>
      <div className="space-y-3">
        {testimonials?.map((t) => (
          <div key={t.id} className="p-4 rounded-xl" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8b5cf6" }}>{t.role}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Btn onClick={() => startEdit(t)} variant="ghost">Edit</Btn>
                <Btn onClick={() => handleDelete(t.id)} variant="danger">Delete</Btn>
              </div>
            </div>
            <p className="text-xs italic" style={{ color: "#64748b" }}>"{t.quote}"</p>
            <div className="mt-2 flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <span key={s} style={{ color: s <= t.rating ? "#f59e0b" : "#334155", fontSize: "0.75rem" }}>★</span>
              ))}
            </div>
          </div>
        ))}
        {(!testimonials || testimonials.length === 0) && <p className="text-sm" style={{ color: "#475569" }}>No testimonials yet.</p>}
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const { data: analytics } = useGetAnalytics({ request: { headers: getAuthHeaders() } } as any);
  const chartData = [
    { name: "Page Views", value: analytics?.pageViews ?? 0 },
    { name: "CV Downloads", value: analytics?.cvDownloads ?? 0 },
    { name: "Messages", value: analytics?.totalMessages ?? 0 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff" }}>Analytics</h2>
      <div className="p-5 rounded-xl" style={{ background: "#0d1426", border: "1px solid #1e293b" }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#0d1426", border: "1px solid #1e293b", color: "#e2e8f0" }} />
            <Bar dataKey="value" fill="#00f5ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ===== MAIN ADMIN PAGE =====

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();
  const hasToken = !!getToken();
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = useAdminMe({
    query: {
      enabled: hasToken,
      retry: false,
    },
  } as any);

  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginMutation.mutateAsync({ data: { username, password } });
      if (result.token) {
        setToken(result.token);
        refetchSession();
        toast.success("Welcome, " + username);
      }
    } catch {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    removeToken();
    await logoutMutation.mutateAsync();
    queryClient.clear();
    refetchSession();
    toast.success("Logged out");
  };

  if (hasToken && sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080c18" }}>
        <div className="text-lg" style={{ color: "#00f5ff", fontFamily: "Orbitron, sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (!hasToken || !session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080c18" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ background: "#0d1426", border: "1px solid #1e293b", boxShadow: "0 0 40px #00f5ff0a" }}
        >
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Admin Panel
            </div>
            <p className="text-xs" style={{ color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>Secure access required</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="huzaifa"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: "#0d1a2e", border: "1px solid #1e293b", color: "#e2e8f0", fontFamily: "Space Grotesk, sans-serif" }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs mb-1" style={{ color: "#00f5ff", fontFamily: "JetBrains Mono, monospace" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: "#0d1a2e", border: "1px solid #1e293b", color: "#e2e8f0", fontFamily: "Space Grotesk, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", color: "#080c18", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", opacity: loginMutation.isPending ? 0.7 : 1 }}
            >
              {loginMutation.isPending ? "Authenticating..." : "Login"}
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="/" className="text-xs" style={{ color: "#475569" }}>Back to Portfolio</a>
          </div>
        </motion.div>
      </div>
    );
  }

  const SECTION_COMPONENTS: Record<Section, React.ReactElement> = {
    dashboard: <DashboardSection />,
    messages: <MessagesSection />,
    projects: <ProjectsSection />,
    skills: <SkillsSection />,
    certifications: <CertificationsSection />,
    testimonials: <TestimonialsSection />,
    social: <SocialSection />,
    bio: <BioSection />,
    analytics: <AnalyticsSection />,
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#080c18", fontFamily: "Space Grotesk, sans-serif" }}>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between" style={{ background: "#0d1426", borderBottom: "1px solid #1e293b" }}>
        <div className="font-bold" style={{ fontFamily: "Orbitron, sans-serif", color: "#00f5ff", fontSize: "1rem" }}>Admin Panel</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "#00f5ff", background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>☰</button>
      </div>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed md:static top-0 left-0 h-full z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "#0a0f1e", borderRight: "1px solid #1e293b", width: "260px" }}
      >
        <div className="p-6 border-b" style={{ borderColor: "#1e293b" }}>
          <div className="font-bold text-lg" style={{ fontFamily: "Orbitron, sans-serif", background: "linear-gradient(135deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Panel</div>
          <div className="text-xs mt-1" style={{ color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{session.username}</div>
        </div>
        <nav className="p-4 flex-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg mb-1 text-sm flex items-center gap-3 transition-all duration-200"
              style={{
                background: activeSection === item.id ? "#00f5ff15" : "transparent",
                color: activeSection === item.id ? "#00f5ff" : "#94a3b8",
                border: activeSection === item.id ? "1px solid #00f5ff22" : "1px solid transparent",
                cursor: "pointer",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "#1e293b" }}>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all"
            style={{ background: "#7f1d1d22", border: "1px solid #7f1d1d44", color: "#fca5a5", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 mt-12 md:mt-0 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {SECTION_COMPONENTS[activeSection]}
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
