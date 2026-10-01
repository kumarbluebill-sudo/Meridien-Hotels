import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";

import { ROOMS } from "@/lib/data";
import { RoomAdvisor } from "@/components/room-advisor";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms & Rates — Meridian Hotel" },
      {
        name: "description",
        content:
          "Standard rooms, deluxe kings and executive suites at Meridian Hotel. Sizes, amenities and nightly rates.",
      },
      { property: "og:title", content: "Rooms & Rates — Meridian Hotel" },
      {
        property: "og:description",
        content:
          "Standard rooms, deluxe kings and executive suites — quiet, modern and work-ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Stay
      </p>
      <h1 className="mt-4 font-display text-4xl font-light tracking-tight sm:text-5xl">
        Rooms & rates
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Every room includes high-speed Wi-Fi, a proper work desk, blackout
        curtains and breakfast options. Rates are per night, taxes included.
      </p>

      <div className="mt-12">
        <RoomAdvisor />
      </div>

      <div className="mt-16 flex flex-col gap-16">
        {ROOMS.map((room, i) => (
          <article
            key={room.id}
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>img]:order-2" : ""
            }`}
          >
            <img
              src={room.image}
              alt={room.name}
              loading="lazy"
              width={1280}
              height={912}
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-3xl font-semibold tracking-tight">
                  {room.name}
                </h2>
                <p className="shrink-0 text-sm text-muted-foreground">
                  from{" "}
                  <span className="font-display text-2xl font-semibold text-foreground">
                    ${room.rate}
                  </span>
                  /night
                </p>
              </div>
              <p className="mt-2 text-muted-foreground">{room.tagline}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {room.size} · {room.bed} · Sleeps {room.capacity}
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {a}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                search={{ room: room.id }}
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Request this room <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
