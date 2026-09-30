import { createFileRoute } from "@tanstack/react-router";

import restaurant from "@/assets/restaurant.jpg";
import gym from "@/assets/gym.jpg";
import meeting from "@/assets/meeting.jpg";
import lobby from "@/assets/lobby.jpg";

export const Route = createFileRoute("/amenities")({
  head: () => ({
    meta: [
      { title: "Amenities & Experiences — Meridian Hotel" },
      {
        name: "description",
        content:
          "Meeting rooms, 24/7 gym, all-day restaurant and bar, airport transfers and concierge at Meridian Hotel.",
      },
      {
        property: "og:title",
        content: "Amenities & Experiences — Meridian Hotel",
      },
      {
        property: "og:description",
        content:
          "Boardrooms, a skyline gym, all-day dining and a concierge that handles the rest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AmenitiesPage,
});

const SECTIONS = [
  {
    image: meeting,
    title: "Meetings & events",
    text: "Six boardrooms for 4–14 people and a 40-seat event studio, all with natural light, screens and video-conferencing built in. Book by the hour or the day — catering from our kitchen included on request.",
    facts: ["6 boardrooms", "40-seat studio", "Hourly or daily hire"],
  },
  {
    image: restaurant,
    title: "Restaurant & bar",
    text: "Breakfast from 6:00 for early flights, an all-day menu built around seasonal produce, and a bar that stays open until late. Room service runs until 23:00.",
    facts: ["Breakfast 6:00–10:30", "All-day dining", "Bar until 01:00"],
  },
  {
    image: gym,
    title: "Fitness, around the clock",
    text: "A full gym on the top floor with treadmills, free weights and rowing machines — open 24/7 with your room key. Towels and water always stocked.",
    facts: ["Open 24/7", "Top-floor skyline views", "Towels & water provided"],
  },
  {
    image: lobby,
    title: "Concierge & transfers",
    text: "Our front desk arranges airport transfers, restaurant reservations, laundry and anything else that makes a work trip smoother. Transfers can be charged to your room.",
    facts: ["Airport transfers", "Same-day laundry", "24-hour front desk"],
  },
];

function AmenitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        The hotel
      </p>
      <h1 className="mt-4 font-display text-4xl font-light tracking-tight sm:text-5xl">
        Amenities & experiences
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Everything a work trip needs, under one roof — and nothing it doesn't.
      </p>

      <div className="mt-14 flex flex-col gap-16">
        {SECTIONS.map((s, i) => (
          <section
            key={s.title}
            className={`grid items-center gap-10 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>img]:order-2" : ""
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              loading="lazy"
              width={1280}
              height={912}
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {s.text}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.facts.map((f) => (
                  <li
                    key={f}
                    className="rounded-sm border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
