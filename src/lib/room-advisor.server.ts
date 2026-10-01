import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayRunIdFetch } from "./ai-run-id.server";
import { ROOMS } from "./data";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export const adviceSchema = z.object({
  summary: z.string(),
  recommendations: z
    .array(
      z.object({
        roomId: z.enum(["standard", "deluxe", "suite"]),
        label: z.enum(["Best match", "Alternative"]),
        reason: z.string(),
        budgetNote: z.string().nullable(),
      }),
    )
    .min(1)
    .max(3),
  tips: z.array(z.string()).max(3),
});

export type RoomAdvice = z.infer<typeof adviceSchema>;

export interface AdvisorInput {
  checkIn: string;
  checkOut: string;
  guests: number;
  budgetPerNight: number | null;
  preferences: string;
}

function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

export async function recommendRooms(input: AdvisorInput): Promise<
  RoomAdvice & { nights: number }
> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "The room finder isn't configured yet. Please try again later.",
    );
  }

  const nights = nightsBetween(input.checkIn, input.checkOut);
  const inventory = ROOMS.map((r) => ({
    id: r.id,
    name: r.name,
    size: r.size,
    bed: r.bed,
    capacity: r.capacity,
    ratePerNight: r.rate,
    amenities: r.amenities,
  }));

  const gateway = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: gateway.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    output: Output.object({ schema: adviceSchema }),
    maxRetries: 0,
    system: [
      "You are the reservations advisor for Meridian Hotel, a modern city hotel for business travellers.",
      "Recommend only rooms from the provided inventory, using their exact ids.",
      "Rank at most three rooms: exactly one 'Best match', the rest 'Alternative'.",
      "Respect the guest's party size (never suggest a room that cannot hold them) and their budget per night.",
      "If every room is above budget, still recommend the closest option and say so plainly in budgetNote.",
      "Never claim a room is available or confirmed — the hotel team confirms availability by email.",
      "Keep the summary to two sentences, each reason to one or two sentences, and tips short and practical.",
    ].join(" "),
    prompt: [
      `Inventory: ${JSON.stringify(inventory)}`,
      `Check-in: ${input.checkIn}`,
      `Check-out: ${input.checkOut} (${nights} night${nights === 1 ? "" : "s"})`,
      `Guests: ${input.guests}`,
      `Budget per night: ${input.budgetPerNight ? `$${input.budgetPerNight}` : "not specified"}`,
      `Preferences: ${input.preferences || "none given"}`,
    ].join("\n"),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const advice = await result.output;
  return { ...advice, nights };
}
