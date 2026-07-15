"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Mode = "online" | "offline" | "hybrid";
type Status = "idle" | "loading" | "error";

interface FormState {
  title: string;
  description: string;
  overview: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: Mode;
  audience: string;
  organizer: string;
  agenda: string[];
  tags: string[];
  image: File | null;
  imagePreview: string | null;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  overview: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "online",
  audience: "",
  organizer: "",
  agenda: [""],
  tags: [],
  image: null,
  imagePreview: null,
};

// ── Shared input class ─────────────────────────────────────────────────────
const INPUT =
  "w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand-border transition-all duration-150";

// ── Label ──────────────────────────────────────────────────────────────────
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {children}
    </label>
  );
}

// ── Section card ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-raised rounded-2xl bg-card border border-border p-6 flex flex-col gap-5">
      <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tagInput, setTagInput] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  // ── Field helpers ──────────────────────────────────────────────────────
  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  // ── Agenda ─────────────────────────────────────────────────────────────
  const setAgendaItem = (i: number, value: string) =>
    setForm((prev) => {
      const agenda = [...prev.agenda];
      agenda[i] = value;
      return { ...prev, agenda };
    });

  const addAgendaItem = () =>
    setForm((prev) => ({ ...prev, agenda: [...prev.agenda, ""] }));

  const removeAgendaItem = (i: number) =>
    setForm((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, idx) => idx !== i),
    }));

  // ── Tags ───────────────────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag || form.tags.includes(tag)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      setErrorMsg("Please upload an event image.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("overview", form.overview);
    data.append("venue", form.venue);
    data.append("location", form.location);
    data.append("date", form.date);
    data.append("time", form.time);
    data.append("mode", form.mode);
    data.append("audience", form.audience);
    data.append("organizer", form.organizer);
    data.append("image", form.image);
    // Arrays must be serialized — POST route uses Object.fromEntries
    data.append("agenda", JSON.stringify(form.agenda.filter(Boolean)));
    data.append("tags", JSON.stringify(form.tags));

    try {
      const res = await fetch("/api/events", { method: "POST", body: data });
      const json = (await res.json()) as { event?: { slug: string }; message?: string };

      if (!res.ok) {
        setErrorMsg(json.message ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      router.push(`/events/${json.event?.slug}`);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const loading = status === "loading";

  return (
    <main className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-8 stagger-children">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-muted border border-brand-border text-brand text-xs font-semibold mb-4 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            New Event
          </span>
          <h1 className="text-gradient-brand animate-fade-in mb-2">
            Create an Event
          </h1>
          <p className="text-muted-foreground text-sm animate-fade-in">
            Fill in the details below. All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── Image upload ────────────────────────────────────── */}
          <Section title="Event Image *">
            <div
              onClick={() => imageRef.current?.click()}
              className="relative w-full h-52 rounded-xl border-2 border-dashed border-border hover:border-brand-border transition-colors duration-150 cursor-pointer overflow-hidden bg-muted group"
            >
              {form.imagePreview ? (
                <Image src={form.imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground group-hover:text-brand transition-colors duration-150">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 5v18M5 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload image</span>
                  <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
                </div>
              )}
              {form.imagePreview && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Change image</span>
                </div>
              )}
            </div>
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </Section>

          {/* ── Basic info ──────────────────────────────────────── */}
          <Section title="Basic Info">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title *</Label>
              <input id="title" className={INPUT} placeholder="e.g. React Summit 2025" required value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Short Description *</Label>
              <textarea id="description" rows={2} className={`${INPUT} resize-none`} placeholder="One or two sentences summarising the event" required value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="overview">Full Overview *</Label>
              <textarea id="overview" rows={4} className={`${INPUT} resize-none`} placeholder="Detailed description of what attendees can expect" required value={form.overview} onChange={(e) => set("overview", e.target.value)} />
            </div>
          </Section>

          {/* ── Logistics ───────────────────────────────────────── */}
          <Section title="Logistics">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">Date *</Label>
                <input id="date" type="date" className={INPUT} required value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="time">Time *</Label>
                <input id="time" type="time" className={INPUT} required value={form.time} onChange={(e) => set("time", e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="venue">Venue *</Label>
              <input id="venue" className={INPUT} placeholder="e.g. Mozilla HQ, Auditorium B" required value={form.venue} onChange={(e) => set("venue", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location *</Label>
              <input id="location" className={INPUT} placeholder="e.g. San Francisco, CA" required value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>

            {/* Mode selector */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mode">Mode *</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["online", "offline", "hybrid"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, mode: m }))}
                    className={`py-2 rounded-xl border text-sm font-medium capitalize transition-all duration-150 ${
                      form.mode === m
                        ? "bg-brand-muted border-brand-border text-brand"
                        : "border-border text-muted-foreground hover:border-brand-border hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── People ──────────────────────────────────────────── */}
          <Section title="People">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organizer">Organizer *</Label>
              <input id="organizer" className={INPUT} placeholder="e.g. React Community PH" required value={form.organizer} onChange={(e) => set("organizer", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="audience">Target Audience *</Label>
              <input id="audience" className={INPUT} placeholder="e.g. Frontend Developers, Beginners welcome" required value={form.audience} onChange={(e) => set("audience", e.target.value)} />
            </div>
          </Section>

          {/* ── Agenda ──────────────────────────────────────────── */}
          <Section title="Agenda *">
            <div className="flex flex-col gap-2">
              {form.agenda.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-brand-muted border border-brand-border text-brand text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <input
                    className={INPUT}
                    placeholder={`Agenda item ${i + 1}`}
                    value={item}
                    onChange={(e) => setAgendaItem(i, e.target.value)}
                  />
                  {form.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(i)}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
                      aria-label="Remove"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addAgendaItem}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-hover transition-colors duration-150 self-start"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add item
            </button>
          </Section>

          {/* ── Tags ────────────────────────────────────────────── */}
          <Section title="Tags">
            <div className="flex gap-2">
              <input
                className={INPUT}
                placeholder="e.g. react, typescript, web"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              />
              <button
                type="button"
                onClick={addTag}
                className="shrink-0 px-4 py-2.5 rounded-xl border border-brand-border text-brand text-sm font-medium hover:bg-brand-muted transition-colors duration-150"
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-muted border border-brand-border text-brand">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors" aria-label={`Remove ${tag}`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Press Enter or click Add after each tag.</p>
          </Section>

          {/* ── Error ───────────────────────────────────────────── */}
          {errorMsg && (
            <p className="text-sm text-destructive text-center px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
              {errorMsg}
            </p>
          )}

          {/* ── Submit ──────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" />
                </svg>
                Publishing Event…
              </>
            ) : (
              <>
                Publish Event
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
