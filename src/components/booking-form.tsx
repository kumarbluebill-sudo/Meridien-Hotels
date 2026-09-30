import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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
import { submitBookingRequest } from "@/lib/forms.functions";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookingForm({ defaultRoom }: { defaultRoom?: string | undefined }) {
  const submit = useServerFn(submitBookingRequest);
  const [roomType, setRoomType] = useState(defaultRoom ?? ROOMS[0]!.id);
  const [checkIn, setCheckIn] = useState(todayPlus(7));
  const [checkOut, setCheckOut] = useState(todayPlus(9));
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in.");
      return;
    }
    setPending(true);
    try {
      await submit({
        data: {
          roomType,
          checkIn,
          checkOut,
          guests: Number(guests),
          name,
          email,
          phone: phone || undefined,
          specialRequests: specialRequests || undefined,
        },
      });
      setDone(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" />
        <h3 className="font-display text-2xl font-semibold">
          Request received
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you, {name.split(" ")[0]}. Our reservations team will confirm
          availability for {checkIn} → {checkOut} by email within a few hours.
        </p>
        <Button variant="outline" onClick={() => setDone(false)}>
          Make another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="bf-checkin">Check-in</Label>
          <Input
            id="bf-checkin"
            type="date"
            required
            min={todayPlus(0)}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bf-checkout">Check-out</Label>
          <Input
            id="bf-checkout"
            type="date"
            required
            min={checkIn}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Room type</Label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOMS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name} — from ${r.rate}/night
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "guest" : "guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="bf-name">Full name</Label>
          <Input
            id="bf-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Cooper"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bf-email">Email</Label>
          <Input
            id="bf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bf-phone">Phone (optional)</Label>
        <Input
          id="bf-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 555 000 0000"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bf-notes">Special requests (optional)</Label>
        <Textarea
          id="bf-notes"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Early check-in, high floor, dietary needs…"
          rows={3}
        />
      </div>
      <Button type="submit" disabled={pending} className="rounded-sm">
        {pending ? "Sending…" : "Request booking"}
      </Button>
      <p className="text-xs text-muted-foreground">
        This is a booking request, not a confirmed reservation. No payment is
        taken — our team confirms availability by email.
      </p>
    </form>
  );
}
