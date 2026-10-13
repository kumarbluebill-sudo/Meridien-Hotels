import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function anon() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await anon()
    .from("reviews")
    .select("id, name, rating, comment, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) {
    console.error("reviews load failed", error);
    return [];
  }
  return data ?? [];
});

const reviewSchema = z.object({
  name: z.string().trim().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000),
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => reviewSchema.parse(d))
  .handler(async ({ data }) => {
    const { error } = await anon().from("reviews").insert({ ...data, approved: false });
    if (error) {
      console.error("review insert failed", error);
      throw new Error("We couldn't submit your review. Please try again.");
    }
    return { ok: true };
  });
