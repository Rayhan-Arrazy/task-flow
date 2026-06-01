"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  LayoutGrid,
  Upload,
  Shield,
  Sparkles,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: <Layers className="size-5" />,
    title: "AI Priority Suggestions",
    description:
      "AI analyzes your tasks and automatically suggests optimal priority levels — High, Medium, or Low.",
  },
  {
    icon: <LayoutGrid className="size-5" />,
    title: "Kanban Board View",
    description:
      "Organize tasks visually with drag-and-drop columns for Todo, In Progress, and Done statuses.",
  },
  {
    icon: <Upload className="size-5" />,
    title: "Real-time Analytics",
    description:
      "Track productivity with live statistics, completion rates, and beautiful visual dashboards.",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secured. Full authentication system with JWT-based sessions.",
  },
];

const demoTasks = [
  {
    title: "Fix authentication bug in production",
    priority: "HIGH",
    status: "IN_PROGRESS",
  },
  {
    title: "Design new onboarding flow",
    priority: "MEDIUM",
    status: "TODO",
  },
  {
    title: "Update README documentation",
    priority: "LOW",
    status: "DONE",
  },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-animated-gradient relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[rgba(10,10,15,0.6)] px-6 py-5 backdrop-blur-xl md:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-decoration-none"
        >
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6c5ce7] via-[#a855f7] to-[#6366f1] text-lg">
            <Zap className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            TaskFlow <span className="text-[#6c5ce7]">AI</span>
          </span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#6c5ce7] text-white hover:bg-[#7c6df7]"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-[1] flex min-h-screen flex-col items-center justify-center px-5 pt-[120px] pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge
            variant="outline"
            className="mb-8 gap-2 border-[#6c5ce7]/20 bg-[#6c5ce7]/10 px-4 py-2 text-[13px] font-medium text-[#6c5ce7]"
          >
            <Sparkles className="ai-sparkle size-3.5" />
            Powered by AI
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-6 max-w-[800px] text-[clamp(40px,6vw,72px)] leading-[1.1] font-black"
        >
          Manage Tasks with{" "}
          <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
            AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-10 max-w-[560px] text-lg leading-relaxed text-muted-foreground"
        >
          Create tasks effortlessly and let AI analyze their importance. TaskFlow
          AI automatically suggests priority levels so you can focus on what
          matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex gap-4"
        >
          <Link href="/register">
            <Button
              size="lg"
              className="h-12 bg-[#6c5ce7] px-8 text-base text-white hover:bg-[#7c6df7] hover:shadow-[0_4px_20px_rgba(108,92,231,0.3)]"
            >
              Start for Free
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Hero demo card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-20 w-full max-w-[700px]"
        >
          <Card className="border-white/8 bg-[rgba(26,26,46,0.7)] backdrop-blur-[30px]">
            <CardContent className="p-6">
              {/* Window dots */}
              <div className="mb-5 flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-[#ff5f57]" />
                <div className="size-2.5 rounded-full bg-[#febd2f]" />
                <div className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[13px] text-muted-foreground">
                  TaskFlow AI Dashboard
                </span>
              </div>

              {/* Demo tasks */}
              <div className="space-y-2">
                {demoTasks.map((task, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                    className="flex items-center justify-between rounded-[10px] border border-white/5 bg-white/[0.02] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-[18px] items-center justify-center rounded-[5px] border-2 text-[10px] text-white ${
                          task.status === "DONE"
                            ? "border-[var(--status-done)] bg-[var(--status-done)]"
                            : "border-border bg-transparent"
                        }`}
                      >
                        {task.status === "DONE" && (
                          <Check className="size-2.5" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          task.status === "DONE"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6c5ce7]">🤖 AI</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase ${
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-[1] mx-auto max-w-[1100px] px-5 pt-20 pb-[120px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-extrabold">
            Everything you need to{" "}
            <span className="text-[#6c5ce7]">stay productive</span>
          </h2>
          <p className="mx-auto max-w-[500px] text-base text-muted-foreground">
            Built with modern technologies and designed for teams who want to
            work smarter, not harder.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group h-full cursor-default border-white/10 bg-[rgba(26,26,46,0.8)] backdrop-blur-[30px] transition-all duration-300 hover:-translate-y-1 hover:border-[#6c5ce7]/30">
                <CardContent className="p-8">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#6c5ce7]/10 text-[#6c5ce7]">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-[1] px-5 pt-20 pb-[120px] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mx-auto max-w-[700px] border-white/10 bg-[rgba(26,26,46,0.8)] backdrop-blur-[30px]">
            <CardContent className="px-10 py-[60px]">
              <h2 className="mb-4 text-[32px] font-extrabold">
                Ready to boost your productivity?
              </h2>
              <p className="mb-8 text-base text-muted-foreground">
                Join TaskFlow AI and let artificial intelligence handle your task
                prioritization.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 bg-[#6c5ce7] px-10 text-base text-white hover:bg-[#7c6df7]"
                >
                  Get Started — It&apos;s Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-[1] flex items-center justify-between border-t border-border px-6 py-8 text-[13px] text-muted-foreground md:px-10">
        <span>© 2026 TaskFlow AI. All rights reserved.</span>
        <span>Built with Next.js + AI</span>
      </footer>
    </div>
  );
}
