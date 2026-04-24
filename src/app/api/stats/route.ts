import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [total, high, medium, low, todo, inProgress, done, recentTasks] =
      await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, priority: "HIGH" } }),
        prisma.task.count({ where: { userId, priority: "MEDIUM" } }),
        prisma.task.count({ where: { userId, priority: "LOW" } }),
        prisma.task.count({ where: { userId, status: "TODO" } }),
        prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
        prisma.task.count({ where: { userId, status: "DONE" } }),
        prisma.task.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      total,
      byPriority: { high, medium, low },
      byStatus: { todo, inProgress, done },
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      recentTasks,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
