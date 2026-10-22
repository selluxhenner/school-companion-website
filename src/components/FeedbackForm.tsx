"use client";

import { useEffect, useRef, useState } from "react";
import { APP_NAME, CONTACT_EMAIL, FEEDBACK_ENDPOINT } from "@/lib/site";

type Kind = "bug" | "idea";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  // fallback: the request itself failed, so offer the mailto with what was typed.
  | { state: "error"; message: string; fallback?: boolean };

// Limits mirror the endpoint's validation, so the browser stops what the server would reject.
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 4000;

const KINDS: { value: Kind; label: string }[] = [
  { value: "bug", label: "Fehler melden" },
  { value: "idea", label: "Idee teilen" },
];

const inputClass =
  "mt-1.5 block w-full rounded-control border border-line-2 bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-3 focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30";
const labelClass = "block text-sm font-semibold text-ink";
const hintClass = "font-normal text-slate-500";

function errorFor(status: number, retryAfter: string | null): string {
  if (status === 400) {
    return "Das hat nicht geklappt. Prüf, ob deine Nachricht mindestens 10 Zeichen hat und die E-Mail-Adresse stimmt.";
  }
  if (status === 413) {
    return "Deine Nachricht ist zu lang. Kürz sie bitte etwas.";
  }
  if (status === 429) {
    const minutes = Math.ceil(Number(retryAfter) / 60);
    return Number.isFinite(minutes) && minutes > 0
      ? `Du hast in der letzten Stunde schon mehrere Nachrichten geschickt. Versuch es in ${minutes} ${minutes === 1 ? "Minute" : "Minuten"} nochmals.`
      : "Du hast in der letzten Stunde schon mehrere Nachrichten geschickt. Versuch es später nochmals.";
  }
  return "Deine Nachricht konnte gerade nicht gesendet werden.";
}

export default function FeedbackForm() {
  const [kind, setKind] = useState<Kind>("bug");
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [device, setDevice] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const doneRef = useRef<HTMLDivElement>(null);

  // The thank-you box is far shorter than the form it replaces; bring it into view.
  useEffect(() => {
    if (status.state === "sent") {
      doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      doneRef.current?.focus();
    }
  }, [status.state]);

  const handleReset = () => {
    setKind("bug");
    setMessage("");
    setSteps("");
    setAppVersion("");
    setDevice("");
    setContact("");
    setWebsite("");
    setStatus({ state: "idle" });
  };

  // The old mailto, prefilled with what was typed, for when the request fails.
  const mailto = () => {
    const subject = `${APP_NAME}: ${kind === "bug" ? "Fehler melden" : "Idee"}`;
    const body = [
      message.slice(0, 1500),
      kind === "bug" && steps ? `\nSchritte:\n${steps.slice(0, 500)}` : "",
      `\nApp-Version: ${appVersion}`,
      `Gerät und System: ${device}`,
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length < MESSAGE_MIN) {
      setStatus({ state: "error", message: `Schreib bitte mindestens ${MESSAGE_MIN} Zeichen.` });
      return;
    }
    if (contact.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setStatus({ state: "error", message: "Die E-Mail-Adresse sieht nicht richtig aus." });
      return;
    }
    setStatus({ state: "sending" });
    const payload = {
      type: kind,
      message: message.trim(),
      ...(kind === "bug" && steps.trim() ? { steps: steps.trim() } : {}),
      ...(appVersion.trim() ? { appVersion: appVersion.trim() } : {}),
      ...(device.trim() ? { device: device.trim() } : {}),
      ...(contact.trim() ? { contact: contact.trim() } : {}),
      website,
    };
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 201) {
        setStatus({ state: "sent" });
        return;
      }
      setStatus({
        state: "error",
        message: errorFor(res.status, res.headers.get("Retry-After")),
        fallback: true,
      });
    } catch {
      setStatus({ state: "error", message: errorFor(0, null), fallback: true });
    }
  };

  if (status.state === "sent") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border border-brand/40 bg-brand-soft px-5 py-5 focus:outline-none"
      >
        <p className="font-semibold text-ink">Danke! Deine Nachricht ist angekommen.</p>
        <p className="mt-1 text-sm text-slate-700">
          {contact.trim()
            ? "Wir lesen sie und melden uns per E-Mail, falls wir Fragen haben."
            : "Wir lesen jede Nachricht. Ohne E-Mail-Adresse können wir dir allerdings nicht antworten."}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-brand-dark ring-1 ring-line-2 hover:bg-white"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    // noValidate: our own German messages instead of the browser's bubbles.
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className={labelClass}>Worum geht es?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <label
              key={k.value}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-line-2 has-[:checked]:bg-brand-dark has-[:checked]:text-white has-[:checked]:ring-brand-dark has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand"
            >
              <input
                type="radio"
                name="type"
                value={k.value}
                checked={kind === k.value}
                onChange={() => setKind(k.value)}
                className="sr-only"
              />
              {k.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="fb-message" className={labelClass}>
          {kind === "bug" ? "Was ist passiert, und was hättest du erwartet?" : "Was wünschst du dir, und wofür würdest du es brauchen?"}
        </label>
        <textarea
          id="fb-message"
          required
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
        <p className="tnum mt-1 text-right text-xs text-slate-500">
          {message.length} / {MESSAGE_MAX}
        </p>
      </div>

      {kind === "bug" && (
        <div>
          <label htmlFor="fb-steps" className={labelClass}>
            Wie kommt man dorthin? <span className={hintClass}>(optional)</span>
          </label>
          <textarea
            id="fb-steps"
            maxLength={2000}
            rows={3}
            placeholder="z. B. Noten → Mathematik → Note hinzufügen → Speichern"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-version" className={labelClass}>
            App-Version <span className={hintClass}>(optional)</span>
          </label>
          <input
            id="fb-version"
            maxLength={30}
            placeholder="z. B. 1.3.0"
            value={appVersion}
            onChange={(e) => setAppVersion(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">Steht ganz unten in den Einstellungen.</p>
        </div>
        <div>
          <label htmlFor="fb-device" className={labelClass}>
            Gerät und System <span className={hintClass}>(optional)</span>
          </label>
          <input
            id="fb-device"
            maxLength={120}
            placeholder="z. B. iPhone 13, iOS 18"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="fb-contact" className={labelClass}>
          Deine E-Mail-Adresse <span className={hintClass}>(optional)</span>
        </label>
        <input
          id="fb-contact"
          type="email"
          autoComplete="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-500">Nur nötig, wenn du eine Antwort möchtest.</p>
      </div>

      {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="fb-website">Website</label>
        <input
          id="fb-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status.state === "error" && (
        <div role="alert" className="rounded-card border border-accent/40 bg-accent/5 px-5 py-4 text-sm text-slate-700">
          <p className="font-semibold text-ink">{status.message}</p>
          {status.fallback && (
            <p className="mt-1">
              Du kannst es nochmals versuchen oder uns{" "}
              <a href={mailto()} className="font-medium text-brand-dark underline">
                per E-Mail schreiben
              </a>{" "}
              &ndash; deine Angaben sind dort schon eingefüllt.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="inline-block rounded-lg bg-brand-dark px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {sending ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}
