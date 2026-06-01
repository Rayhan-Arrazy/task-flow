export type PrioritySuggestion = {
  priority: "HIGH" | "MEDIUM" | "LOW";
  reasoning: string;
};

export async function suggestPriority(
  title: string,
  description?: string
): Promise<PrioritySuggestion> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return fallbackPriority(title, description);
  }

  try {
    const prompt = `You are a task priority analyzer. Based on the task title and description, suggest a priority level.
    
Task Title: ${title}
${description ? `Task Description: ${description}` : ""}

Rules:
- HIGH: Urgent, critical, blocking, deadline-sensitive, or has significant impact
- MEDIUM: Important but not urgent, standard work items
- LOW: Nice-to-have, minor improvements, non-urgent maintenance`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                priority: {
                  type: "string",
                  enum: ["HIGH", "MEDIUM", "LOW"],
                },
                reasoning: {
                  type: "string"
                }
              },
              required: ["priority", "reasoning"]
            }
          }
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return fallbackPriority(title, description);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      const parsed = JSON.parse(text);
      if (["HIGH", "MEDIUM", "LOW"].includes(parsed.priority)) {
        return {
          priority: parsed.priority,
          reasoning: parsed.reasoning || "AI-suggested priority",
        };
      }
    }

    return fallbackPriority(title, description);
  } catch (error) {
    console.error("Gemini error:", error);
    return fallbackPriority(title, description);
  }
}

function fallbackPriority(
  title: string,
  description?: string
): PrioritySuggestion {
  const text = `${title} ${description || ""}`.toLowerCase();

  const highKeywords = [
    "urgent", "critical", "asap", "emergency", "blocker",
    "deadline", "immediately", "breaking", "crash", "security",
    "production", "hotfix", "bug", "fix", "error",
  ];
  const lowKeywords = [
    "nice to have", "optional", "someday", "minor", "cleanup",
    "refactor", "style", "typo", "cosmetic", "documentation",
    "docs", "readme",
  ];

  if (highKeywords.some((kw) => text.includes(kw))) {
    return { priority: "HIGH", reasoning: "Contains urgent/critical keywords" };
  }

  if (lowKeywords.some((kw) => text.includes(kw))) {
    return { priority: "LOW", reasoning: "Contains non-urgent/minor keywords" };
  }

  return { priority: "MEDIUM", reasoning: "Standard priority based on content analysis" };
}
