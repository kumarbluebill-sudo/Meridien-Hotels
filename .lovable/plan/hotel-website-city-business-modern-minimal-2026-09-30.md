# Hotel Website — City / Business, Modern & Minimal

A modern, minimal website for a city business hotel with a booking-request form (no live availability or payments). Working name placeholder: "Meridian Hotel" — easily renamed.

## Pages (4 routes)

1. **Home (`/`)** — Full-width hero with hotel photography, headline, and a prominent "Check availability" booking bar (dates + guests). Below: brief intro, room highlights teaser, amenities strip, testimonial, footer CTA.
2. **Rooms & Rates (`/rooms`)** — 3–4 room types (e.g. Standard, Deluxe, Executive Suite) with photo, size, bed, capacity, amenities list, and nightly rate. Each card links into the booking form with the room pre-selected.
3. **Amenities & Experiences (`/amenities`)** — Business-focused amenities: meeting rooms, high-speed Wi-Fi, gym, restaurant/bar, airport transfer, concierge. Alternating image/text rows.
4. **Contact & Location (`/contact`)** — Contact form, address, phone/email, embedded-style map visual, transport/directions info.

## Booking request flow

- Booking bar on the home hero + a dedicated booking panel reachable from every room card (`/contact` or a booking section with room pre-selected via URL state).
- Form fields: check-in / check-out dates, guests, room type, name, email, phone, special requests.
- On submit: validated with Zod, stored in a **Lovable Cloud database table** (`booking_requests`), and a confirmation screen is shown. No payment, no live availability — staff follow up by email/phone.
- Contact form submissions stored in a `contact_messages` table.

## Design direction — Modern & Minimal

- **Palette:** Paper & Ink — off-white background (#f5f3ee), rich near-black text (#0d0d0d), one restrained accent for CTAs. Generous whitespace, thin hairline dividers.
- **Typography:** Clean sans-serif pairing (Urbanist for display headings, Epilogue for body) — suits architecture/hospitality. Large, light-weight headlines with tight tracking.
- **Layout:** Split-screen hero (image one side, booking bar the other), then full-width editorial sections. Sharp or minimally rounded corners, no heavy shadows.
- **Imagery:** AI-generated photography — hotel exterior, lobby, 3–4 room interiors, restaurant, gym — consistent muted, architectural style.
- **Motion:** Restrained — subtle fade/slide on scroll, hover states on cards and buttons only.

## Technical details

- TanStack Start routes: `index.tsx`, `rooms.tsx`, `amenities.tsx`, `contact.tsx`; shared header/nav + footer in `__root.tsx`.
- Each route gets its own `head()` with unique title/description/og tags.
- Design tokens defined in `src/styles.css` (oklch), fonts loaded via `<link>` in root head.
- Lovable Cloud enabled for the two tables (`booking_requests`, `contact_messages`) with RLS allowing public inserts; submissions via a `createServerFn` server function.
- shadcn-style components (Button, Input, Select, Calendar/date picker) themed to the tokens; sonner toasts for form feedback.

## Build order

1. Enable Lovable Cloud; create tables + migration.
2. Design tokens, fonts, root layout (header/footer).
3. Generate imagery (exterior, lobby, rooms, amenities).
4. Home page with hero booking bar.
5. Rooms, Amenities, Contact pages.
6. Booking-request server function + form wiring + confirmation state.
7. Verify build, test the form end-to-end in the preview.
