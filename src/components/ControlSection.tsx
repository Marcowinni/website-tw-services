import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { APPROVALS, PORTAL_URL } from "../content/portal";

const ease = [0.16, 1, 0.3, 1] as const;

// The trust argument: four approvals as a rail that fills as you scroll past, and the payment
// guarantee beside it as the one quiet panel on the page.
export function ControlSection() {
  return (
    <section id="kontrolle" className="py-section-y">
      <div className="container-x grid grid-cols-12 gap-x-6 lg:gap-x-12 gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <div className="eyebrow mb-6">
            <span>Ihre Kontrolle</span>
          </div>
          <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
            Nichts geht ohne Ihre <em className="italic text-navy">Freigabe</em> live.
          </h2>
          <p className="mt-6 text-lg text-slate2 leading-relaxed max-w-prose-lg">
            Jeder Schritt kommt zuerst zu Ihnen ins Portal. Sie kommentieren direkt am Inhalt, wir setzen um, Sie geben frei.
          </p>

          <ol className="mt-12">
            {APPROVALS.map((a, i) => (
              <motion.li
                key={a.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="relative grid grid-cols-[2.25rem_1fr] gap-x-5 pb-8 last:pb-0"
              >
                {i < APPROVALS.length - 1 && (
                  <motion.span
                    aria-hidden
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease }}
                    className="absolute left-[1.0625rem] top-9 bottom-0 w-px bg-navy origin-top"
                  />
                )}
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-navy text-cloud">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-medium text-ink">{a.title}</h3>
                  <p className="mt-1.5 text-slate2 leading-relaxed">{a.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="col-span-12 lg:col-span-5 self-end bg-navy-50 border border-navy-100 p-8 sm:p-10"
        >
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-navy">Zufriedenheitsgarantie</div>
          <p className="mt-5 font-display text-3xl sm:text-4xl leading-[1.12] text-ink text-balance">
            Bezahlt wird erst, wenn Ihnen das <em className="italic text-navy">Projektvideo gefällt.</em>
          </p>
          <p className="mt-5 text-slate2 leading-relaxed">
            Bis dahin sehen Sie es als Vorschau mit Wasserzeichen. Gefällt es Ihnen nach der Korrekturrunde nicht, zahlen Sie nichts.
          </p>
          {/* The guarantee is clause 11 of the TWS Studio AGB, published on the portal. */}
          <a
            href={`${PORTAL_URL}/rechtliches/agb#zufriedenheitsgarantie`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-navy underline underline-offset-4 decoration-navy/30 hover:decoration-navy"
          >
            Details in den AGB von TWS Studio
          </a>
        </motion.aside>
      </div>
    </section>
  );
}
