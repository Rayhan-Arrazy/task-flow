"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutGrid,
  CheckSquare,
  Settings,
  LogOut,
  Menu,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SidebarContent({
  pathname,
  session,
  onSignOut,
  onNavigate,
}: {
  pathname: string;
  session: ReturnType<typeof useSession>["data"];
  onSignOut: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="border-b border-border px-5 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6c5ce7] via-[#a855f7] to-[#6366f1]">
            <Zap className="size-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">
            TaskFlow <span className="text-[#6c5ce7]">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`mx-3 my-0.5 flex items-center gap-3 rounded-[10px] px-5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#6c5ce7]/10 text-[#6c5ce7]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-[#6c5ce7]/10 text-sm font-bold text-[#6c5ce7]">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-foreground">
              {session?.user?.name || "User"}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {session?.user?.email || ""}
            </div>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={onSignOut}
              />
            }
          >
            <LogOut className="size-4" />
            Sign Out
          </TooltipTrigger>
          <TooltipContent>Sign out of your account</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[260px] flex-col border-r border-border bg-card md:flex">
        <SidebarContent
          pathname={pathname}
          session={session}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-[55] md:hidden"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            pathname={pathname}
            session={session}
            onSignOut={handleSignOut}
            onNavigate={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="min-h-screen flex-1 p-5 md:ml-[260px] md:p-8">
        {children}
      </main>
    </div>
  );
}
