import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { listReviews, submitReview } from "@/lib/reviews.functions";

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="disabled:cursor-default"
        >
          <Star className={`h-4 w-4 ${n <= value ? "fill-accent text-accent" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

export function Reviews() {
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews"], queryFn: () => listReviews() });
  const send = useServerFn(submitReview);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || comment.trim().length < 10) {
      toast.error("Please add your name and a review of at least 10 characters.");
      return;
    }
    setBusy(true);
    try {
      await send({ data: { name, rating, comment } });
      toast.success("Thank you! Your review will appear once approved.");
      setName("");
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section id="reviews" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">Guest reviews</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">What our guests say</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Stars value={Math.round(avg)} />
              {avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your stay.</p>
            )}
            {reviews.map((r) => (
              <article key={r.id} className="border border-border bg-card p-5">
                <Stars value={r.rating} />
                <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {r.name} · {new Date(r.created_at).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 border border-border bg-card p-6">
            <p className="font-display text-lg font-semibold">Write a review</p>
            <Stars value={rating} onChange={setRating} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your stay"
              rows={4}
              maxLength={1000}
              className="rounded-sm border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              disabled={busy}
              className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/85 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Submit review"}
            </button>
            <p className="text-xs text-muted-foreground">Reviews are published after a quick check by our team.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
