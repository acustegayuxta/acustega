import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert in acoustic interior design and AI image generation prompts. Analyze the acoustic consultation conversation and generate a single, highly detailed visual prompt optimized for Midjourney and DALL-E.

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
- Color palette derived from the space description (3-5 dominant colors)
- Atmosphere and mood (intimate, professional, creative, warm, futuristic)
- Camera angle and framing (wide angle interior, eye level, golden ratio composition)
- Rendering style (photorealistic, architectural visualization, 8K, cinematic lighting)

Keep the prompt between 120 and 180 words. Do not include acoustic performance metrics or dB values. Make it visually compelling and commercially appealing.`;

export async function POST(req: NextRequest) {
  const { messages, spaceLabel } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }
  if (!messages?.length) {
    return Response.json({ error: "No conversation provided" }, { status: 400 });
  }

  const conversationText = (messages as Array<{ role: string; text: string }>)
    .filter((m) => m.text?.trim())
    .map((m) => `${m.role === "user" ? "Client" : "Advisor"}: ${m.text}`)
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Space type: ${spaceLabel}\n\nConsultation conversation:\n${conversationText}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    // Strip markdown fences if present
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
