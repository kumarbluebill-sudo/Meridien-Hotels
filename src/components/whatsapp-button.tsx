import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { HOTEL } from "@/lib/data";

const link = (text: string) => `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(text)}`;

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 border border-border bg-card p-4 shadow-lg">
          <p className="font-display font-semibold">Chat with us on WhatsApp</p>
          <p className="mt-1 text-xs text-muted-foreground">We usually reply within minutes.</p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={link(`Hi ${HOTEL.name}, I'd like to book a room. Dates: ___ to ___, guests: ___.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/85"
            >
              Book on WhatsApp
            </a>
            <a
              href={link(`Hi ${HOTEL.name}, I have a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-input px-3 py-2 text-center text-sm font-medium hover:bg-accent/10"
            >
              Ask a question
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="WhatsApp chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
