"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Priority Suggestions",
    description: "YandexGPT analyzes your tasks and automatically suggests optimal priority levels — High, Medium, or Low.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Kanban Board View",
    description: "Organize tasks visually with drag-and-drop columns for Todo, In Progress, and Done statuses.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: "Real-time Analytics",
    description: "Track productivity with live statistics, completion rates, and beautiful visual dashboards.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Secure & Private",
    description: "Your data is encrypted and secured. Full authentication system with JWT-based sessions.",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-animated-gradient" style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10, 10, 15, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--gradient-hero)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}>
            ⚡
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
            TaskFlow <span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login">
            <button className="btn-secondary">Sign In</button>
          </Link>
          <Link href="/register">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        padding: "120px 20px 80px",
        position: "relative",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 100,
            background: "var(--accent-soft)",
            border: "1px solid rgba(108, 92, 231, 0.2)",
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--accent)",
          }}>
            <span className="ai-sparkle">✨</span>
            Powered by YandexGPT
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Manage Tasks with{" "}
          <span style={{
            background: "var(--gradient-hero)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          Create tasks effortlessly and let AI analyze their importance. 
          TaskFlow AI automatically suggests priority levels so you can focus on what matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{ display: "flex", gap: 16 }}
        >
          <Link href="/register">
            <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
              Start for Free →
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: "14px 32px", fontSize: 16 }}>
              Sign In
            </button>
          </Link>
        </motion.div>

        {/* Hero demo card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{
            marginTop: 80,
            width: "100%",
            maxWidth: 700,
            background: "rgba(26, 26, 46, 0.7)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 24,
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febd2f" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 12, fontSize: 13, color: "var(--text-muted)" }}>TaskFlow AI Dashboard</span>
          </div>

          {/* Demo tasks */}
          {[
            { title: "Fix authentication bug in production", priority: "HIGH", status: "IN_PROGRESS" },
            { title: "Design new onboarding flow", priority: "MEDIUM", status: "TODO" },
            { title: "Update README documentation", priority: "LOW", status: "DONE" },
          ].map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10,
                marginBottom: i < 2 ? 8 : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `2px solid ${task.status === "DONE" ? "var(--status-done)" : "var(--border)"}`,
                  background: task.status === "DONE" ? "var(--status-done)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "white",
                }}>
                  {task.status === "DONE" && "✓"}
                </div>
                <span style={{
                  fontSize: 14,
                  color: task.status === "DONE" ? "var(--text-muted)" : "var(--text-primary)",
                  textDecoration: task.status === "DONE" ? "line-through" : "none",
                }}>
                  {task.title}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--accent)" }}>🤖 AI</span>
                <span className={`badge badge-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: "80px 20px 120px",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
            Everything you need to{" "}
            <span style={{ color: "var(--accent)" }}>stay productive</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Built with modern technologies and designed for teams who want to work smarter, not harder.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-strong"
              style={{
                padding: 32,
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              whileHover={{ y: -4, borderColor: "rgba(108, 92, 231, 0.3)" }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                marginBottom: 20,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "80px 20px 120px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card-strong"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: "60px 40px",
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
            Ready to boost your productivity?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>
            Join TaskFlow AI and let artificial intelligence handle your task prioritization.
          </p>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: "16px 40px", fontSize: 16 }}>
              Get Started — It&apos;s Free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 40px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 1,
        fontSize: 13,
        color: "var(--text-muted)",
      }}>
        <span>© 2026 TaskFlow AI. All rights reserved.</span>
        <span>Built with Next.js + YandexGPT</span>
      </footer>
    </div>
  );
}
