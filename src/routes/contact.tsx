import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { z } from "zod";
import { MapPin, Phone, Mail, TrainFront, Plane, Car } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingForm } from "@/components/booking-form";
import { HOTEL, ROOMS } from "@/lib/data";
import { submitContactMessage } from "@/lib/forms.functions";

const searchSchema = z.object({
  room: z.enum(["standard", "deluxe", "suite"]).optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Contact & Location — Meridian Hotel" },
      {
        name: "description",
        content:
          "Find Meridian Hotel in the Central District, send a booking request, or get in touch with our team.",
      },
      { property: "og:title", content: "Contact & Location — Meridian Hotel" },
      {
        property: "og:description",
        content:
          "Ten minutes from the financial district — directions, contact details and booking requests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactForm() {
  const submit = useServerFn(submitContactMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await submit({ data: { name, email, message } });
      toast.success("Message sent — we'll reply within one business day.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cf-name">Name</Label>
          <Input
            id="cf-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cf-email">Email</Label>
          <Input
            id="cf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cf-message">Message</Label>
        <Textarea
          id="cf-message"
          required
          minLength={10}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-fit rounded-sm">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

const DIRECTIONS = [
  {
    icon: Plane,
    title: "From the airport",
    text: "25 minutes by taxi or take the express train to Central Station, then a 5-minute walk.",
  },
  {
    icon: TrainFront,
    title: "By train",
    text: "Central Station is 400 m away — exit toward Riverside Avenue and follow the river.",
  },
  {
    icon: Car,
    title: "By car",
    text: "Underground parking on site, $32/night. EV chargers on level -1.",
  },
];

function ContactPage() {
  const { room } = Route.useSearch();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Get in touch
      </p>
      <h1 className="mt-4 font-display text-4xl font-light tracking-tight sm:text-5xl">
        Contact & location
      </h1>

      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        {/* Booking request */}
        <section id="booking" className="border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Request a booking
          </h2>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            {room
              ? `You're requesting the ${ROOMS.find((r) => r.id === room)?.name}.`
              : "Tell us your dates and we'll confirm availability."}
          </p>
          <BookingForm defaultRoom={room} />
        </section>

        {/* Details + contact form */}
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Find us
            </h2>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent" />
                {HOTEL.address}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                {HOTEL.phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                {HOTEL.email}
              </p>
            </div>
            <div className="mt-8 grid gap-6">
              {DIRECTIONS.map((d) => (
                <div key={d.title} className="flex gap-4">
                  <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold">{d.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {d.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Send a message
            </h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              Questions about events, long stays or corporate rates.
            </p>
            <ContactForm />
          </section>
        </div>
      </div>
    </div>
  );
}
