import type { APIRoute } from "astro";

// «Projekt starten»: validates the request and mails it to the team via Resend. Runs on demand
// (the rest of the site is static). Needs RESEND_API_KEY in the Vercel environment; the sender
// domain tw-services.ch is verified at Resend.
export const prerender = false;

const TO = "info@tw-services.ch";
const FROM = "TW Services Website <info@tw-services.ch>";
const PACKAGES: Record<string, string> = {
  offen: "Noch offen",
  video: "Video",
  "video-lp": "Video und Landingpage",
  "video-kampagne": "Video und Kampagne",
  vollsystem: "Vollsystem",
};
const MIN_FILL_MS = 3000; // faster than a person can fill the form: a bot
const MAX = { name: 120, company: 160, email: 200, phone: 40, project: 200, message: 3000 };

type Input = Record<string, unknown>;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function validate(body: Input) {
  const f = {
    name: str(body.name, MAX.name),
    company: str(body.company, MAX.company),
    email: str(body.email, MAX.email),
    phone: str(body.phone, MAX.phone),
    project: str(body.project, MAX.project),
    package: typeof body.package === "string" && Object.hasOwn(PACKAGES, body.package) ? body.package : "offen",
    message: str(body.message, MAX.message),
  };
  const errors: Record<string, string> = {};
  if (f.name.length < 2) errors.name = "Bitte Ihren Namen angeben.";
  if (f.company.length < 2) errors.company = "Bitte die Firma angeben.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (f.project.length < 2) errors.project = "Bitte das Projekt nennen, zum Beispiel Name und Ort.";
  return { f, errors };
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

export const POST: APIRoute = async ({ request }) => {
  let body: Input;
  try {
    body = (await request.json()) as Input;
  } catch {
    return json(400, { error: "invalid_json" });
  }

  // Spam: the hidden field is filled or the form was sent implausibly fast. Answer as if it
  // worked, so bots learn nothing.
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  if (str(body.website, 200) || elapsed < MIN_FILL_MS) return json(200, { ok: true });

  const { f, errors } = validate(body);
  if (Object.keys(errors).length) return json(400, { errors });

  const key = process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
  if (!key) {
    console.error("start form: RESEND_API_KEY missing");
    return json(500, { error: "not_configured" });
  }

  const rows: [string, string][] = [
    ["Name", f.name],
    ["Firma", f.company],
    ["E-Mail", f.email],
    ["Telefon", f.phone || "nicht angegeben"],
    ["Projekt", f.project],
    ["Paket", PACKAGES[f.package]],
    ["Nachricht", f.message || "keine"],
  ];
  const text = `Neue Anfrage «Projekt starten» über tw-services.ch\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nNächster Schritt: Auftrag und Portal-Zugang anlegen, innert eines Arbeitstags antworten.`;
  const html = `<p>Neue Anfrage «Projekt starten» über tw-services.ch</p><table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#6B7884;vertical-align:top">${k}</td><td style="white-space:pre-wrap">${escape(v)}</td></tr>`)
    .join("")}</table><p style="font-family:Arial,sans-serif;font-size:13px;color:#6B7884">Nächster Schritt: Auftrag und Portal-Zugang anlegen, innert eines Arbeitstags antworten.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: f.email,
      subject: `Projekt starten: ${f.project} (${f.company})`,
      text,
      html,
    }),
  });
  if (!res.ok) {
    console.error("start form: resend failed", res.status, await res.text().catch(() => ""));
    return json(502, { error: "send_failed" });
  }
  return json(200, { ok: true });
};
