import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarCheck, Loader2, Mail, Phone } from "lucide-react";
import { BOOKING_URL, CONTACT, PACKAGES, type PackageId } from "../content/portal";

type Fields = { name: string; company: string; email: string; phone: string; project: string; package: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", company: "", email: "", phone: "", project: "", package: "offen", message: "" };

// Same checks as the server (src/pages/api/start.ts); the server stays the authority.
function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Bitte Ihren Namen angeben.";
  if (f.company.trim().length < 2) e.company = "Bitte die Firma angeben.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (f.project.trim().length < 2) e.project = "Bitte das Projekt nennen, zum Beispiel Name und Ort.";
  return e;
}

// «Projekt starten»: the start form on a navy chapter, with the direct ways to reach us beside it.
// After sending, we set up the portal access and reply within one working day (Till, 06.10.2026).
export function StartSection() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const openedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  // A package chosen in the comparison arrives as ?paket=… in the link.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("paket");
    if (p && PACKAGES.some((x) => x.id === p)) setFields((f) => ({ ...f, package: p as PackageId }));
  }, []);

  const set = (key: keyof Fields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: ev.target.value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`start-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot.current?.value ?? "", elapsedMs: Date.now() - openedAt.current }),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (body?.errors) setErrors(body.errors);
      setState(body?.errors ? "idle" : "failed");
    } catch {
      setState("failed");
    }
  };

  return (
    <section id="contact" className="bg-navy text-cloud">
      <span id="start" className="block -translate-y-[120px]" aria-hidden />
      <div className="container-x py-section-y grid grid-cols-12 gap-x-6 lg:gap-x-12 gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <div className="eyebrow mb-6 !text-cloud/70 before:!bg-cloud/70">
            <span>Projekt starten</span>
          </div>
          <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
            Erzählen Sie uns von <em className="italic text-navy-200">Ihrem Projekt.</em>
          </h2>
          <p className="mt-6 text-lg text-cloud/80 leading-relaxed max-w-prose-lg">
            Wir richten Ihren Portal-Zugang ein und melden uns innert eines Arbeitstags. Danach laden Sie Ihre Unterlagen hoch, und es geht los.
          </p>

          <div className="mt-12 grid gap-px bg-cloud/15 border border-cloud/15">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-navy px-6 py-5 hover:bg-navy-600 transition-colors duration-300"
            >
              <CalendarCheck className="h-5 w-5 text-cloud/80" />
              <span className="flex-1">
                <span className="block font-medium">Lieber zuerst sprechen?</span>
                <span className="block text-sm text-cloud/70">Erstgespräch buchen, 15 bis 30 Minuten, kostenlos</span>
              </span>
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-4 bg-navy px-6 py-5 hover:bg-navy-600 transition-colors duration-300">
              <Mail className="h-5 w-5 text-cloud/80" />
              <span className="flex-1 font-medium">{CONTACT.email}</span>
            </a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="group flex items-center gap-4 bg-navy px-6 py-5 hover:bg-navy-600 transition-colors duration-300">
              <Phone className="h-5 w-5 text-cloud/80" />
              <span className="flex-1 font-medium">{CONTACT.phone}</span>
              <span className="text-sm text-cloud/60">Mo–Fr, 09–18 Uhr</span>
            </a>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="bg-cloud text-ink p-6 sm:p-10 shadow-lift">
            {state === "sent" ? (
              <div role="status" className="py-10">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-navy text-cloud">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 10.5 8 14l7.5-8" />
                  </svg>
                </div>
                <h3 className="mt-6 font-display text-3xl">Danke, Ihre Anfrage ist bei uns.</h3>
                <p className="mt-3 text-slate2 leading-relaxed max-w-prose-lg">
                  Wir richten Ihren Portal-Zugang ein und melden uns innert eines Arbeitstags bei {fields.email}.
                </p>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                <Field id="name" label="Name" value={fields.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                <Field id="company" label="Firma" value={fields.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
                <Field id="email" label="E-Mail" type="email" value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                <Field id="phone" label="Telefon" optional type="tel" value={fields.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
                <Field id="project" label="Projekt" hint="Name und Ort, zum Beispiel «Lindenmatt, Uster»" value={fields.project} onChange={set("project")} error={errors.project} wide />
                <div className="sm:col-span-2 grid gap-2">
                  <label htmlFor="start-package" className="text-sm font-medium">Paket</label>
                  <select id="start-package" value={fields.package} onChange={set("package")} className="field">
                    <option value="offen">Noch offen, beraten Sie mich</option>
                    {PACKAGES.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 grid gap-2">
                  <label htmlFor="start-message" className="text-sm font-medium">
                    Nachricht <span className="font-normal text-slate2">(optional)</span>
                  </label>
                  <textarea id="start-message" rows={4} value={fields.message} onChange={set("message")} className="field py-3 min-h-[7rem] resize-y" />
                </div>
                {/* Spam trap: invisible to people, filled in by bots. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="start-website">Website</label>
                  <input ref={honeypot} id="start-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="sm:col-span-2 mt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60 disabled:cursor-wait">
                    {state === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Wird gesendet
                      </>
                    ) : (
                      "Anfrage senden"
                    )}
                  </button>
                  <p className="text-sm text-slate2">
                    Mit dem Senden akzeptieren Sie unsere{" "}
                    <a href="/datenschutz" className="underline underline-offset-2 hover:text-ink">Datenschutzerklärung</a>.
                  </p>
                </div>
                {state === "failed" && (
                  <p role="alert" className="sm:col-span-2 text-sm text-[#B42318]">
                    Das hat nicht geklappt. Bitte schreiben Sie uns an{" "}
                    <a className="underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> oder rufen Sie an: {CONTACT.phone}.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  optional,
  wide,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  type?: string;
  optional?: boolean;
  wide?: boolean;
  autoComplete?: string;
}) {
  const fid = `start-${id}`;
  return (
    <div className={`grid gap-2 content-start ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={fid} className="text-sm font-medium">
        {label} {optional && <span className="font-normal text-slate2">(optional)</span>}
      </label>
      <input
        id={fid}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        className="field"
      />
      {error ? (
        <p id={`${fid}-error`} className="text-sm text-[#B42318]">{error}</p>
      ) : (
        hint && <p id={`${fid}-hint`} className="text-sm text-slate2">{hint}</p>
      )}
    </div>
  );
}
