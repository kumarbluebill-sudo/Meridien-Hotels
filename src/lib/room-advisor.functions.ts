import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const advisorInputSchema = z
  .object({
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
    guests: z.number().int().min(1).max(6),
    budgetPerNight: z.number().int().min(50).max(5000).nullable(),
    preferences: z.string().max(600),
  })
  .refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
    message: "Check-out must be after check-in",
  });

export const getRoomRecommendations = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => advisorInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { recommendRooms } = await import("./room-advisor.server");
    try {
      return await recommendRooms(data);
    } catch (error) {
      console.error("room advisor failed", error);
      const message =
        error instanceof Error && /configured/.test(error.message)
          ? error.message
          : "We couldn't put together suggestions just now. Please try again.";
      throw new Error(message);
    }
  });
