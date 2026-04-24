"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Stats {
  total: number;
  byPriority: { high: number; medium: number; low: number };
  byStatus: { todo: number; inProgress: number; done: number };
  completionRate: number;
  recentTasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <DashboardSkeleton />;
  }

  if (!session) return null;

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.total || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      color: "var(--accent)",
    },
    {
      label: "High Priority",
      value: stats?.byPriority.high || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: "var(--priority-high)",
    },
    {
      label: "In Progress",
      value: stats?.byStatus.inProgress || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      color: "var(--status-progress)",
    },
    {
      label: "Completed",
      value: stats?.byStatus.done || 0,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: "var(--status-done)",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}
        >
          Welcome back, {session.user?.name?.split(" ")[0]} 👋
        </motion.h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          Here&apos;s an overview of your task activity
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}>
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress & Distribution */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}>
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stat-card"
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Completion Rate</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `conic-gradient(var(--accent) ${(stats?.completionRate || 0) * 3.6}deg, var(--bg-input) 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
              }}>
                {stats?.completionRate || 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
                {stats?.byStatus.done || 0} of {stats?.total || 0} tasks completed
              </div>
              <div className="progress-bar" style={{ width: 160 }}>
                <div className="progress-bar-fill" style={{ width: `${stats?.completionRate || 0}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="stat-card"
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Priority Distribution</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "High", value: stats?.byPriority.high || 0, color: "var(--priority-high)", bg: "var(--priority-high-bg)" },
              { label: "Medium", value: stats?.byPriority.medium || 0, color: "var(--priority-medium)", bg: "var(--priority-medium-bg)" },
              { label: "Low", value: stats?.byPriority.low || 0, color: "var(--priority-low)", bg: "var(--priority-low-bg)" },
            ].map((item) => {
              const total = stats?.total || 1;
              const pct = Math.round((item.value / total) * 100) || 0;
              return (
                <div key={item.label}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 13,
                    fontWeight: 500,
                  }}>
                    <span style={{ color: item.color }}>{item.label}</span>
                    <span style={{ color: "var(--text-muted)" }}>{item.value} ({pct}%)</span>
                  </div>
                  <div style={{
                    height: 6,
                    background: "var(--bg-input)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      style={{
                        height: "100%",
                        background: item.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="stat-card"
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Tasks</h3>
          <Link href="/dashboard/tasks">
            <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>
              View All →
            </button>
          </Link>
        </div>

        {stats?.recentTasks && stats.recentTasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stats.recentTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: task.status === "DONE"
                      ? "var(--status-done)"
                      : task.status === "IN_PROGRESS"
                        ? "var(--status-progress)"
                        : "var(--status-todo)",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: task.status === "DONE" ? "var(--text-muted)" : "var(--text-primary)",
                    textDecoration: task.status === "DONE" ? "line-through" : "none",
                  }}>
                    {task.title}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <p style={{ fontSize: 15, marginBottom: 8, color: "var(--text-secondary)" }}>No tasks yet</p>
            <p style={{ fontSize: 13 }}>Create your first task to get started</p>
            <Link href="/dashboard/tasks">
              <button className="btn-primary" style={{ marginTop: 16 }}>
                Create Task
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 280, height: 32, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: 200, height: 18 }} />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 32,
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 140 }} />
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20,
      }}>
        <div className="skeleton" style={{ height: 200 }} />
        <div className="skeleton" style={{ height: 200 }} />
      </div>
    </div>
  );
}
