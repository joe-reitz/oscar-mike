import { NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { getCategoryForDay } from "@/lib/categories";
import { getHolidayForDate } from "@/lib/holidays";
import { buildPrompt, buildHolidayPrompt } from "@/lib/prompts";
import {
  formatCategoryMessage,
  formatHolidayMessage,
  postToSlack,
} from "@/lib/slack";

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const dayOfWeek = today.getDay();

  // Skip weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json({ message: "Weekend — standing down" });
  }

  try {
    const holiday = getHolidayForDate(today);

    let prompt: { system: string; user: string };
    let formatMessage: (body: string) => { blocks: unknown[]; text: string };

    if (holiday) {
      prompt = buildHolidayPrompt(holiday, today);
      formatMessage = (body) => formatHolidayMessage(holiday, body);
    } else {
      const category = getCategoryForDay(dayOfWeek);
      prompt = buildPrompt(category, today);
      formatMessage = (body) => formatCategoryMessage(category, body);
    }

    const { text } = await generateText({
      model: gateway("anthropic/claude-sonnet-4.5"),
      system: prompt.system,
      prompt: prompt.user,
      maxOutputTokens: 500,
    });

    const message = formatMessage(text);
    await postToSlack(message as Parameters<typeof postToSlack>[0]);

    return NextResponse.json({
      message: "Posted successfully",
      holiday: holiday?.name ?? null,
      category: holiday ? "holiday" : getCategoryForDay(dayOfWeek).id,
    });
  } catch (error) {
    console.error("Oscar Mike failed to post:", error);
    return NextResponse.json(
      { error: "Failed to generate or post message" },
      { status: 500 }
    );
  }
}
