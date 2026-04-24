"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || !session) return null;

  return (
    <div style={{ maxWidth: 640 }}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Settings</motion.h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>Manage your account preferences</p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Profile</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
            {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{session.user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{session.user?.email}</div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>YandexGPT Integration</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Configure your AI API keys for priority suggestions. Set these as environment variables on your server.</p>
        <div style={{ padding: 16, background: "var(--bg-input)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <code style={{ fontSize: 12, color: "var(--accent)" }}>
            YANDEX_API_KEY=your-api-key<br />
            YANDEX_FOLDER_ID=your-folder-id
          </code>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
          💡 Without API keys, TaskFlow AI uses a built-in keyword-based priority engine as fallback.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Tech Stack</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
          {[["Frontend", "Next.js 15"], ["Language", "TypeScript"], ["Styling", "Tailwind CSS"], ["Database", "PostgreSQL"], ["ORM", "Prisma"], ["AI", "YandexGPT"], ["Auth", "NextAuth.js v5"], ["Deploy", "Vercel + Railway"]].map(([k, v]) => (
            <div key={k} style={{ padding: "10px 14px", background: "var(--bg-input)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-muted)" }}>{k}: </span>
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
