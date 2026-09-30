import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wifi, Briefcase, Dumbbell, Coffee } from "lucide-react";

import heroExterior from "@/assets/hero-exterior.jpg";
import lobby from "@/assets/lobby.jpg";
import { ROOMS } from "@/lib/data";
import { BookingForm } from "@/components/booking-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Hotel — Modern City Hotel in the Central District" },
      {
        name: "description",
        content:
          "A quiet, modern city hotel designed for business travel. Book rooms, suites and meeting spaces at Meridian Hotel.",
      },
      {
        property: "og:title",
        content: "Meridian Hotel — Modern City Hotel in the Central District",
      },
      {
        property: "og:description",
        content:
          "A quiet, modern base in the heart of the city — designed for people who travel to work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const HIGHLIGHTS = [
  { icon: Wifi, title: "Fast Wi-Fi everywhere", text: "1 Gbps fiber in every room and public space." },
  { icon: Briefcase, title: "Meeting-ready", text: "Six boardrooms and a 40-seat event studio." },
  { icon: Dumbbell, title: "24/7 fitness", text: "A full gym with skyline views, open around the clock." },
  { icon: Coffee, title: "All-day dining", text: "Breakfast from 6:00, bar until late." },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 lg:py-28 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-16">
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Central District · City Hotel
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] font-light tracking-tight sm:text-6xl">
            Work the city.
            <br />
            <span className="font-semibold">Sleep above it.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Meridian is a modern business hotel ten minutes from the financial
            district — quiet rooms, fast Wi-Fi, and meeting spaces that make
            travel feel effortless.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              See rooms <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/amenities"
              className="inline-flex items-center rounded-sm border border-input px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Explore amenities
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] lg:min-h-[560px]">
          <img
            src={heroExterior}
            alt="Meridian Hotel exterior at dusk"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1088}
          />
        </div>
      </section>

      {/* Booking bar */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Check availability
          </h2>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            Send a request — our team confirms within a few hours.
          </p>
          <BookingForm />
        </div>
      </section>

      {/* Intro / lobby */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
        <img
          src={lobby}
          alt="Meridian Hotel lobby"
          loading="lazy"
          width={1280}
          height={960}
          className="aspect-[4/3] w-full rounded-sm object-cover"
        />
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            The hotel
          </p>
          <h2 className="mt-4 font-display text-3xl font-light tracking-tight sm:text-4xl">
            Designed for people who travel to work
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            One hundred and twenty rooms across fourteen floors, each with a
            proper desk, blackout curtains, and sound-insulated windows.
            Downstairs: an all-day restaurant, a bar that stays open late, and
            six boardrooms you can book by the hour.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Check-in from 15:00, check-out until 12:00. Late checkout is always
            included with suites.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title}>
              <h.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-semibold">{h.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms teaser */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
            Rooms & suites
          </h2>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            All rooms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              to="/rooms"
              className="group border border-border bg-card transition-colors hover:border-foreground/30"
            >
              <img
                src={room.image}
                alt={room.name}
                loading="lazy"
                width={1280}
                height={912}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {room.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    from <span className="font-medium text-foreground">${room.rate}</span>
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {room.size} · {room.bed}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <blockquote className="font-display text-2xl leading-snug font-light tracking-tight sm:text-3xl">
            “The quietest hotel room I've had in years of weekly travel. Desk,
            Wi-Fi, coffee — everything just works.”
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            — Repeat guest, consulting sector
          </p>
        </div>
      </section>
    </div>
  );
}
