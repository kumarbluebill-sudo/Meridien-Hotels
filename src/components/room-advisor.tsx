import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, Compass, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOMS } from "@/lib/data";
import { getRoomRecommendations } from "@/lib/room-advisor.functions";

type Advice = Awaited<ReturnType<typeof getRoomRecommendations>>;

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function RoomAdvisor() {
  const recommend = useServerFn(getRoomRecommendations);
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(9));
  const [guests, setGuests] = useState("2");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [pending, setPending] = useState(false);
  const [advice, setAdvice] = useState<Advice | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out has to be after check-in.");
      return;
    }
    setPending(true);
    try {
      const result = await recommend({
        data: {
          checkIn,
          checkOut,
          guests: Number(guests),
          budgetPerNight: budget ? Number(budget) : null,
          preferences: preferences.trim(),
        },
      });
      setAdvice(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <Compass className="mt-1 h-5 w-5 shrink-0 text-accent" />
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Find my room
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Tell us your dates, who's travelling and what matters most. Our
            AI-powered advisor suggests the rooms that fit best — our team
            confirms availability when you send the request.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="ra-in">Check-in</Label>
            <Input
              id="ra-in"
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ra-out">Check-out</Label>
            <Input
              id="ra-out"
              type="date"
              required
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ra-guests">Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id="ra-guests">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ra-budget">Budget per night ($)</Label>
            <Input
              id="ra-budget"
              type="number"
              min={50}
              max={5000}
              placeholder="Optional"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ra-prefs">What matters on this trip?</Label>
          <Textarea
            id="ra-prefs"
            rows={3}
            maxLength={600}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. quiet floor, space to work in the evening, early breakfast, high floor with a view"
          />
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="w-fit rounded-sm"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Finding rooms…
            </>
          ) : (
            "Suggest rooms"
          )}
        </Button>
      </form>

      {advice && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="text-sm leading-relaxed">{advice.summary}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Based on {advice.nights} night{advice.nights === 1 ? "" : "s"} ·
            availability confirmed by our team
          </p>

          <div className="mt-6 grid gap-5">
            {advice.recommendations.map((rec) => {
              const room = ROOMS.find((r) => r.id === rec.roomId);
              if (!room) return null;
              return (
                <article
                  key={rec.roomId}
                  className="flex flex-col gap-5 border border-border p-5 sm:flex-row"
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-sm object-cover sm:w-44"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                      {rec.label}
                    </p>
                    <div className="mt-2 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {room.name}
                      </h3>
                      <p className="shrink-0 text-sm text-muted-foreground">
                        ${room.rate}/night ·{" "}
                        <span className="text-foreground">
                          ${room.rate * advice.nights} total
                        </span>
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {rec.reason}
                    </p>
                    {rec.budgetNote && (
                      <p className="mt-2 text-sm leading-relaxed">
                        {rec.budgetNote}
                      </p>
                    )}
                    <Link
                      to="/contact"
                      search={{ room: room.id }}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      Request this room <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {advice.tips.length > 0 && (
            <ul className="mt-6 grid gap-2">
              {advice.tips.map((tip) => (
                <li key={tip} className="text-sm text-muted-foreground">
                  — {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
