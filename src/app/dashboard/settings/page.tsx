"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const techStack = [
  ["Frontend", "Next.js 16"],
  ["Language", "TypeScript"],
  ["Styling", "shadcn/ui"],
  ["Database", "PostgreSQL"],
  ["ORM", "Prisma"],
  ["AI", "Gemini"],
  ["Auth", "NextAuth.js v5"],
  ["Deploy", "Vercel + Railway"],
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || !session) return null;

  return (
    <div className="max-w-[640px]">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2 text-[28px] font-extrabold"
      >
        Settings
      </motion.h1>
      <p className="mb-8 text-[15px] text-muted-foreground">
        Manage your account preferences
      </p>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-gradient-to-br from-[#6c5ce7] via-[#a855f7] to-[#6366f1] text-2xl font-bold text-white">
                  {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-base font-semibold">
                  {session.user?.name}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {session.user?.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* YandexGPT Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-5"
      >
        <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader>
            <CardTitle className="text-base">
              AI Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-[13px] text-muted-foreground">
              Configure your AI API keys for priority suggestions. Set these as
              environment variables on your server.
            </p>
            <div className="rounded-[10px] border border-border bg-input p-4">
              <code className="text-xs text-[#6c5ce7]">
                GEMINI_API_KEY=your-api-key
              </code>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground">
              💡 Without API keys, TaskFlow AI uses a built-in keyword-based
              priority engine as fallback.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6c5ce7]/30">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6c5ce7] via-[#a855f7] to-[#6366f1] opacity-0 transition-opacity group-hover:opacity-100" />
          <CardHeader>
            <CardTitle className="text-base">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5">
              {techStack.map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg border border-border bg-input px-3.5 py-2.5 text-[13px]"
                >
                  <span className="text-muted-foreground">{k}: </span>
                  <span className="font-medium text-[#6c5ce7]">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
