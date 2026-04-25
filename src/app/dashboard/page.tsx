"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

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
      icon: CheckSquare,
      color: "text-[#6c5ce7]",
      bgColor: "bg-[#6c5ce7]/10",
    },
    {
      label: "High Priority",
      value: stats?.byPriority.high || 0,
      icon: AlertTriangle,
      color: "text-[var(--priority-high)]",
      bgColor: "bg-[var(--priority-high)]/10",
    },
    {
      label: "In Progress",
      value: stats?.byStatus.inProgress || 0,
      icon: Clock,
      color: "text-[var(--status-progress)]",
      bgColor: "bg-[var(--status-progress)]/10",
    },
    {
      label: "Completed",
      value: stats?.byStatus.done || 0,
      icon: CheckCircle2,
      color: "text-[var(--status-done)]",
      bgColor: "bg-[var(--status-done)]/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1.5 text-[28px] font-extrabold"
        >
          Welcome back, {session.user?.name?.split(" ")[0]} 👋
        </motion.h1>
        <p className="text-[15px] text-muted-foreground">
          Here&apos;s an overview of your task activity
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${card.bgColor}`}
                    >
                      <Icon className={`size-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="mb-1 text-[32px] font-extrabold">
                    {card.value}
                  </div>
                  <div className="text-[13px] font-medium text-muted-foreground">
                    {card.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progress & Distribution */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <CardTitle className="text-base">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                {/* Circular progress */}
                <div
                  className="relative flex size-[100px] items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#6c5ce7 ${(stats?.completionRate || 0) * 3.6}deg, var(--bg-input) 0deg)`,
                  }}
                >
                  <div className="flex size-[76px] items-center justify-center rounded-full bg-card text-[22px] font-extrabold">
                    {stats?.completionRate || 0}%
                  </div>
                </div>
                <div>
                  <div className="mb-3 text-sm text-muted-foreground">
                    {stats?.byStatus.done || 0} of {stats?.total || 0} tasks
                    completed
                  </div>
                  <Progress
                    value={stats?.completionRate || 0}
                    className="h-1.5 w-40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <CardTitle className="text-base">
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    label: "High",
                    value: stats?.byPriority.high || 0,
                    color: "var(--priority-high)",
                  },
                  {
                    label: "Medium",
                    value: stats?.byPriority.medium || 0,
                    color: "var(--priority-medium)",
                  },
                  {
                    label: "Low",
                    value: stats?.byPriority.low || 0,
                    color: "var(--priority-low)",
                  },
                ].map((item) => {
                  const total = stats?.total || 1;
                  const pct = Math.round((item.value / total) * 100) || 0;
                  return (
                    <div key={item.label}>
                      <div className="mb-1.5 flex justify-between text-[13px] font-medium">
                        <span style={{ color: item.color }}>{item.label}</span>
                        <span className="text-muted-foreground">
                          {item.value} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-sm bg-input">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="h-full rounded-sm"
                          style={{ background: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Tasks</CardTitle>
            <Link href="/dashboard/tasks">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentTasks && stats.recentTasks.length > 0 ? (
              <div className="space-y-2">
                {stats.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-[10px] border border-white/5 bg-white/[0.02] px-4 py-3.5 transition-all duration-200"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          background:
                            task.status === "DONE"
                              ? "var(--status-done)"
                              : task.status === "IN_PROGRESS"
                                ? "var(--status-progress)"
                                : "var(--status-todo)",
                        }}
                      />
                      <span
                        className={`truncate text-sm ${
                          task.status === "DONE"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] font-semibold uppercase ${
                        task.priority === "HIGH"
                          ? "border-[var(--priority-high)]/20 bg-[var(--priority-high-bg)] text-[var(--priority-high)]"
                          : task.priority === "MEDIUM"
                            ? "border-[var(--priority-medium)]/20 bg-[var(--priority-medium-bg)] text-[var(--priority-medium)]"
                            : "border-[var(--priority-low)]/20 bg-[var(--priority-low-bg)] text-[var(--priority-low)]"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <CheckSquare className="mx-auto mb-4 size-12 text-muted-foreground opacity-30" />
                <p className="mb-2 text-[15px] text-muted-foreground">
                  No tasks yet
                </p>
                <p className="mb-4 text-[13px] text-muted-foreground">
                  Create your first task to get started
                </p>
                <Link href="/dashboard/tasks">
                  <Button className="bg-[#6c5ce7] text-white hover:bg-[#7c6df7]">
                    Create Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-2.5 h-8 w-[280px]" />
        <Skeleton className="h-[18px] w-[200px]" />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  );
}
