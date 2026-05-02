import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert in acoustic interior design and AI image generation prompts. Analyze the acoustic consultation conversation and any provided project details, then generate a single, highly detailed visual prompt optimized for Midjourney and DALL-E.

The prompt must describe the OPTIMIZED version of the space — what it will look like AFTER the acoustic treatment is applied. Focus entirely on aesthetics and visual atmosphere, not technical acoustic specs.

Your response must be ONLY valid JSON with this exact structure (no markdown, no code fences, no extra text):
{
  "prompt": "the complete image generation prompt in English, ready to copy and paste"
}

The prompt field must be a single string in English containing:
- Space type and architectural style (e.g. "professional recording studio", "home studio loft", "modern office")
- Acoustic treatment elements as aesthetic features (panels as wall art, diffusers as geometric sculptures, bass traps as corner installations)
- Materials and textures (wood species, fabric colors, foam finishes, concrete, glass)
- Lighting mood (warm Edison bulbs, cyan LED strips, natural skylight, neon accents)
- Color palette derived from the space description and aesthetic preferences (3-5 dominant colors)
- Atmosphere and mood (intimate, professional, creative, warm, futuristic)
- Camera angle and framing (wide angle interior, eye level, golden ratio composition)
- Rendering style (photorealistic, architectural visualization, 8K, cinematic lighting)

Keep the prompt between 120 and 180 words. Do not include acoustic performance metrics or dB values. Make it visually compelling and commercially appealing.`;

interface QuestionnaireData {
  projectName?: string;
  workTypes?: string[];
  peopleCount?: string;
  vocalBooth?: boolean;
  aesthetics?: string[];
  structuralConstraints?: string[];
  budgetRange?: string;
  specificNotes?: string;
}

export async function POST(req: NextRequest) {
  const { messages, spaceLabel, questionnaire } = await req.json() as {
    messages?: Array<{ role: string; text: string }>;
    spaceLabel?: string;
    questionnaire?: QuestionnaireData;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }
  if (!messages?.length && !questionnaire) {
    return Response.json({ error: "No conversation or questionnaire provided" }, { status: 400 });
  }

  const conversationText = (messages || [])
    .filter((m) => m.text?.trim())
    .map((m) => `${m.role === "user" ? "Client" : "Advisor"}: ${m.text}`)
    .join("\n\n");

  let userContent = `Space type: ${spaceLabel || "Not specified"}`;

  if (questionnaire) {
    const q = questionnaire;
    const lines = [
      q.projectName       && `Project name: ${q.projectName}`,
      q.workTypes?.length && `Work type: ${q.workTypes.join(", ")}`,
      q.peopleCount       && `Number of people: ${q.peopleCount}`,
      q.vocalBooth !== undefined && `Vocal booth needed: ${q.vocalBooth ? "Yes" : "No"}`,
      q.aesthetics?.length        && `Visual aesthetics: ${q.aesthetics.join(", ")}`,
      q.structuralConstraints?.length && `Structural constraints: ${q.structuralConstraints.join(", ")}`,
      q.budgetRange       && `Budget range: ${q.budgetRange}`,
      q.specificNotes     && `Specific notes: ${q.specificNotes}`,
    ].filter(Boolean);

    if (lines.length > 0) {
      userContent += `\n\nProject details from client questionnaire:\n${lines.join("\n")}`;
    }
  }

  if (conversationText) {
    userContent += `\n\nConsultation conversation:\n${conversationText}`;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const cleaned = content.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");

    const parsed = JSON.parse(match[0]) as { prompt: string };

    if (!parsed.prompt || typeof parsed.prompt !== "string") {
      throw new Error("Invalid response structure: missing prompt field");
    }

    return Response.json({ prompt: parsed.prompt.trim() });
  } catch (err) {
    const error = err as Error;
    return Response.json(
      { error: error.message || "Error generating design prompt" },
      { status: 500 }
    );
  }
}
