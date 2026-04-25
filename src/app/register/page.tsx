"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated-gradient relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-[1] w-full max-w-[440px]"
      >
        <Card className="border-white/10 bg-[rgba(26,26,46,0.8)] backdrop-blur-[30px]">
          <CardContent className="p-10">
            {/* Logo */}
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-2.5"
            >
              <div className="flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6c5ce7] via-[#a855f7] to-[#6366f1] text-lg">
                <Zap className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                TaskFlow <span className="text-[#6c5ce7]">AI</span>
              </span>
            </Link>

            <h1 className="mb-2 text-center text-2xl font-bold">
              Create your account
            </h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Start managing tasks with AI assistance
            </p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-[10px] border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-[13px] text-destructive"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5 space-y-1.5">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-border bg-input"
                />
              </div>

              <div className="mb-5 space-y-1.5">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border bg-input"
                />
              </div>

              <div className="mb-5 space-y-1.5">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-border bg-input"
                />
              </div>

              <div className="mb-7 space-y-1.5">
                <Label htmlFor="register-confirm-password">
                  Confirm Password
                </Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-border bg-input"
                />
              </div>

              <Button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-[#6c5ce7] py-3 text-[15px] text-white hover:bg-[#7c6df7]"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#6c5ce7] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
