import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const bookingSchema = z
  .object({
    roomType: z.string().min(1),
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
    guests: z.number().int().min(1).max(6),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    specialRequests: z.string().optional(),
  })
  .refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
    message: "Check-out must be after check-in",
  });

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

function getAnonClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getAnonClient();
    const { error } = await supabase.from("booking_requests").insert({
      room_type: data.roomType,
      check_in: data.checkIn,
      check_out: data.checkOut,
      guests: data.guests,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      special_requests: data.specialRequests ?? null,
    });
    if (error) {
      console.error("booking insert failed", error);
      throw new Error("We couldn't submit your request. Please try again.");
    }
    return { ok: true };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getAnonClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });
    if (error) {
      console.error("contact insert failed", error);
      throw new Error("We couldn't send your message. Please try again.");
    }
    return { ok: true };
  });
