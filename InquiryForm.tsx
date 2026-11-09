"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { INTERESTS, validateInquiry, type InquiryErrors, type InquiryInput } from "@/lib/validate";
import { SITE, whatsappLink } from "@/lib/site";

type Props = {
  source?: "contact" | "property";
  propertyId?: number;
  propertyTitle?: string;
  defaultInterest?: string;
  defaultMessage?: string;
  dark?: boolean;
  submitLabel?: string;
};

export function InquiryForm({
  source = "contact",
  propertyId,
  propertyTitle,
  defaultInterest = "",
  defaultMessage = "",
  dark = false,
  submitLabel = "Send enquiry",
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<InquiryInput>({
    name: "",
    phone: "",
    email: "",
    interest: defaultInterest,
    message: defaultMessage,
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof InquiryInput, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const messageRequired = source === "contact";
  const id = (k: string) => `${uid}-${k}`;

  function update<K extends keyof InquiryInput>(k: K, v: string) {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validateInquiry(next, { messageRequired }));
  }
  function blur(k: keyof InquiryInput) {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateInquiry(values, { messageRequired }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateInquiry(values, { messageRequired });
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, message: true, interest: true });
    if (Object.keys(errs).length) {
      const first = (Object.keys(errs)[0] as string) ?? "name";
      document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website, source, propertyId, propertyTitle }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error || "Please check the highlighted fields and try again.");
      setStatus("error");
    } catch {
      setServerError("Network error — your enquiry was not sent.");
      setStatus("error");
    }
  }

  const waText = [
    `Hello Golf Course Property, my name is ${values.name.trim() || "—"}.`,
    propertyTitle ? `I'm interested in: ${propertyTitle}.` : values.interest ? `I'm looking to: ${values.interest}.` : "",
    values.message.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  if (status === "done") {
    return (
      <div role="status" className={`border p-8 text-center ${dark ? "border-white/20 text-white" : "border-sand bg-white"}`}>
        <CheckCircle2 className="mx-auto text-[#1f8f4e]" size={40} aria-hidden />
        <h3 className="font-display mt-4 text-3xl">Thank you, {values.name.split(" ")[0]}.</h3>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-white/75" : "text-stone"}`}>
          Your enquiry has been received and saved. Our team will contact you on {values.phone}. For anything urgent, call us on{" "}
          <a className="font-semibold underline" href={`tel:${SITE.phones[0].tel}`}>
            {SITE.phones[0].display}
          </a>
          .
        </p>
      </div>
    );
  }

  const label = `field-label ${dark ? "!text-white/70" : ""}`;
  const err = (k: keyof InquiryInput) => (touched[k] || status === "error" ? errors[k] : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-label={propertyTitle ? `Enquire about ${propertyTitle}` : "Enquiry form"}>
      <div>
        <label htmlFor={id("name")} className={label}>
          Full name <span aria-hidden>*</span>
        </label>
        <input
          id={id("name")}
          className="field"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => blur("name")}
          aria-invalid={Boolean(err("name"))}
          aria-describedby={err("name") ? id("name-e") : undefined}
        />
        {err("name") && <p id={id("name-e")} className="field-error" role="alert">{err("name")}</p>}
      </div>
      <div>
        <label htmlFor={id("phone")} className={label}>
          Mobile number <span aria-hidden>*</span>
        </label>
        <input
          id={id("phone")}
          type="tel"
          inputMode="tel"
          className="field"
          autoComplete="tel"
          placeholder="e.g. 98917 07020"
          required
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          onBlur={() => blur("phone")}
          aria-invalid={Boolean(err("phone"))}
          aria-describedby={err("phone") ? id("phone-e") : undefined}
        />
        {err("phone") && <p id={id("phone-e")} className="field-error" role="alert">{err("phone")}</p>}
      </div>
      <div>
        <label htmlFor={id("email")} className={label}>
          Email <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id={id("email")}
          type="email"
          className="field"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => blur("email")}
          aria-invalid={Boolean(err("email"))}
          aria-describedby={err("email") ? id("email-e") : undefined}
        />
        {err("email") && <p id={id("email-e")} className="field-error" role="alert">{err("email")}</p>}
      </div>
      {source === "contact" ? (
        <div>
          <label htmlFor={id("interest")} className={label}>
            I would like to
          </label>
          <select id={id("interest")} className="field" value={values.interest} onChange={(e) => update("interest", e.target.value)}>
            <option value="">Select an option</option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
      <div className="sm:col-span-2">
        <label htmlFor={id("message")} className={label}>
          Message {messageRequired && <span aria-hidden>*</span>}
        </label>
        <textarea
          id={id("message")}
          rows={4}
          className="field resize-y"
          required={messageRequired}
          placeholder={source === "property" ? "Preferred time to visit, questions about this property…" : "Tell us what you are looking for — location, type of property, budget…"}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(err("message"))}
          aria-describedby={err("message") ? id("message-e") : undefined}
        />
        {err("message") && <p id={id("message-e")} className="field-error" role="alert">{err("message")}</p>}
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {status === "error" && serverError && (
        <div role="alert" className="sm:col-span-2 border border-crimson/40 bg-crimson/10 p-4 text-sm text-crimson">
          <p className="font-semibold">{serverError}</p>
          <p className="mt-1">
            You can still reach us directly: call{" "}
            <a className="underline" href={`tel:${SITE.phones[0].tel}`}>
              {SITE.phones[0].display}
            </a>{" "}
            or use WhatsApp below.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" className="btn btn-primary sm:min-w-52" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span className="spinner" aria-hidden /> Sending…
            </>
          ) : (
            submitLabel
          )}
        </button>
        <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <MessageCircle size={16} aria-hidden /> Send on WhatsApp
        </a>
        <a href={`tel:${SITE.phones[0].tel}`} className={`btn ${dark ? "btn-ghost-light" : "btn-outline"} sm:hidden`}>
          <Phone size={16} aria-hidden /> Call now
        </a>
      </div>
    </form>
  );
}
