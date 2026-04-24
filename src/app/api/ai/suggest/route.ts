import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { suggestPriority } from "@/lib/yandex-gpt";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const suggestion = await suggestPriority(title, description);

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("AI suggest error:", error);
    return NextResponse.json(
      { error: "Failed to get AI suggestion" },
      { status: 500 }
    );
  }
}
