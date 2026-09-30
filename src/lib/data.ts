import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

export interface Room {
  id: "standard" | "deluxe" | "suite";
  name: string;
  tagline: string;
  size: string;
  bed: string;
  capacity: string;
  rate: number;
  image: string;
  amenities: string[];
}

export const ROOMS: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    tagline: "Everything you need, nothing you don't.",
    size: "24 m²",
    bed: "Queen bed",
    capacity: "2 guests",
    rate: 189,
    image: roomStandard,
    amenities: [
      "High-speed Wi-Fi",
      "Work desk",
      "55\" smart TV",
      "Rain shower",
      "Nespresso machine",
      "Blackout curtains",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe King",
    tagline: "More space, skyline views, quieter floors.",
    size: "32 m²",
    bed: "King bed",
    capacity: "2 guests",
    rate: 259,
    image: roomDeluxe,
    amenities: [
      "High-speed Wi-Fi",
      "Lounge chair",
      "Floor-to-ceiling windows",
      "Rain shower & bathtub",
      "Nespresso machine",
      "Evening turndown",
    ],
  },
  {
    id: "suite",
    name: "Executive Suite",
    tagline: "A separate living room for work and rest.",
    size: "56 m²",
    bed: "King bed + living room",
    capacity: "3 guests",
    rate: 429,
    image: roomSuite,
    amenities: [
      "Separate living area",
      "Corner skyline views",
      "Dining table for four",
      "Club lounge access",
      "Late checkout included",
      "Airport transfer credit",
    ],
  },
];

export const HOTEL = {
  name: "Meridian Hotel",
  address: "48 Riverside Avenue, Central District",
  phone: "+1 (212) 555-0148",
  email: "stay@meridianhotel.com",
};
