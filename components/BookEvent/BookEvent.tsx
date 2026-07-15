"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: wire up to POST /api/bookings
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <div className="w-12 h-12 rounded-full bg-brand-muted border border-brand-border flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M4 11l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground">You&apos;re registered!</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          A confirmation has been sent to <span className="text-brand font-medium">{email}</span>. See you there.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand-border transition-all duration-150 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Registering…
          </>
        ) : (
          <>
            Secure My Spot
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      {status === "error" && (
        <p className="text-xs text-destructive text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
};

export default BookEvent;
