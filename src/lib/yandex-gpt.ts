export type PrioritySuggestion = {
  priority: "HIGH" | "MEDIUM" | "LOW";
  reasoning: string;
};

export async function suggestPriority(
  title: string,
  description?: string
): Promise<PrioritySuggestion> {
  const apiKey = process.env.YANDEX_API_KEY;
  const folderId = process.env.YANDEX_FOLDER_ID;

  if (!apiKey || !folderId) {
    // Fallback: simple keyword-based priority when API is not configured
    return fallbackPriority(title, description);
  }

  try {
    const prompt = `You are a task priority analyzer. Based on the task title and description, suggest a priority level.
    
Task Title: ${title}
${description ? `Task Description: ${description}` : ""}

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{"priority": "HIGH" or "MEDIUM" or "LOW", "reasoning": "brief explanation"}

Rules:
- HIGH: Urgent, critical, blocking, deadline-sensitive, or has significant impact
- MEDIUM: Important but not urgent, standard work items
- LOW: Nice-to-have, minor improvements, non-urgent maintenance`;

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`,
          "x-folder-id": folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${folderId}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.3,
            maxTokens: "200",
          },
          messages: [
            {
              role: "system",
              text: "You are a task priority analyzer. Always respond with valid JSON only.",
            },
            {
              role: "user",
              text: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("YandexGPT API error:", response.status);
      return fallbackPriority(title, description);
    }

    const data = await response.json();
    const text =
      data.result?.alternatives?.[0]?.message?.text || "";

    // Try to parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (["HIGH", "MEDIUM", "LOW"].includes(parsed.priority)) {
        return {
          priority: parsed.priority,
          reasoning: parsed.reasoning || "AI-suggested priority",
        };
      }
    }

    return fallbackPriority(title, description);
  } catch (error) {
    console.error("YandexGPT error:", error);
    return fallbackPriority(title, description);
  }
}

function fallbackPriority(
  title: string,
  description?: string
): PrioritySuggestion {
  const text = `${title} ${description || ""}`.toLowerCase();

  const highKeywords = [
    "urgent",
    "critical",
    "asap",
    "emergency",
    "blocker",
    "deadline",
    "immediately",
    "breaking",
    "crash",
    "security",
    "production",
    "hotfix",
    "bug",
    "fix",
    "error",
  ];
  const lowKeywords = [
    "nice to have",
    "optional",
    "someday",
    "minor",
    "cleanup",
    "refactor",
    "style",
    "typo",
    "cosmetic",
    "documentation",
    "docs",
    "readme",
  ];

  if (highKeywords.some((kw) => text.includes(kw))) {
    return {
      priority: "HIGH",
      reasoning: "Contains urgent/critical keywords",
    };
  }

  if (lowKeywords.some((kw) => text.includes(kw))) {
    return {
      priority: "LOW",
      reasoning: "Contains non-urgent/minor keywords",
    };
  }

  return {
    priority: "MEDIUM",
    reasoning: "Standard priority based on content analysis",
  };
}
