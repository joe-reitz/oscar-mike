import { type Category } from "./categories";
import { type MilitaryHoliday } from "./holidays";

type SlackBlock =
  | { type: "section"; text: { type: "mrkdwn"; text: string } }
  | { type: "context"; elements: { type: "mrkdwn"; text: string }[] }
  | { type: "divider" };

function buildBlocks(
  header: string,
  body: string,
  footer: string
): SlackBlock[] {
  return [
    {
      type: "section",
      text: { type: "mrkdwn", text: header },
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: body },
    },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: footer }],
    },
  ];
}

export function formatCategoryMessage(
  category: Category,
  body: string
): { blocks: SlackBlock[]; text: string } {
  const header = `${category.emoji} *${category.name}*`;
  const footer = "_Oscar Mike — stay on the move_ 🫡";

  return {
    blocks: buildBlocks(header, body, footer),
    text: `${category.emoji} ${category.name}`, // Fallback text
  };
}

export function formatHolidayMessage(
  holiday: MilitaryHoliday,
  body: string
): { blocks: SlackBlock[]; text: string } {
  const countryFlag: Record<string, string> = {
    US: "🇺🇸",
    UK: "🇬🇧",
    Israel: "🇮🇱",
    Norway: "🇳🇴",
    "US/UK": "🇺🇸🇬🇧",
    "UK/Norway": "🇬🇧🇳🇴",
    International: "🌍",
  };

  const flag = countryFlag[holiday.country] ?? "🎖️";
  const header = `${flag} *${holiday.name}*`;
  const footer = "_Oscar Mike — we remember_ 🫡";

  return {
    blocks: buildBlocks(header, body, footer),
    text: `${flag} ${holiday.name}`,
  };
}

export async function postToSlack(payload: {
  blocks: SlackBlock[];
  text: string;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      unfurl_links: false,
      unfurl_media: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Slack webhook failed (${response.status}): ${body}`);
  }
}
