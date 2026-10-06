import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { BOOKING_URL } from "../content/portal";
import { FilmPlayer } from "./FilmPlayer";

const ease = [0.16, 1, 0.3, 1] as const;

// /portal: the page behind the link Till sends out. The film comes first and large; three facts and
// the two ways forward follow, nothing else competes.
export function FilmPage() {
  return (
    <main className="pt-[124px] sm:pt-[140px] pb-section-y">
      <div className="container-x">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-4xl">
          <div className="eyebrow mb-5">
            <span>TWS Studio · Der Film</span>
          </div>
          <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.04] tracking-tight text-balance">
            Ihr Neubauprojekt im Feed <em className="italic text-navy">Ihrer Käufer.</em>
          </h1>
        </motion.div>

        <div className="mt-10 sm:mt-12 flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="w-full lg:flex-1"
            // Keep the whole 16:9 player, play button included, inside the first screen on laptops.
            style={{ maxWidth: "max(20rem, calc((100svh - 22rem) * 16 / 9))" }}
          >
            <FilmPlayer priority />
          </motion.div>

          <div className="lg:w-80 lg:shrink-0">
            <ul className="grid sm:grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-0">
              {[
                ["Rund fünf Minuten", "für Ihre Angaben im Portal. Den Rest machen wir."],
                ["Ihre Freigabe", "bei Skript, Video, Landingpage und Anzeigen."],
                ["Erst zahlen,", "wenn Ihnen das Projektvideo gefällt."],
              ].map(([k, v]) => (
                <li key={k} className="border-t border-line pt-5 lg:py-4 flex sm:flex-col lg:flex-row gap-3">
                  <Check className="h-5 w-5 shrink-0 text-navy mt-0.5" strokeWidth={1.75} />
                  <p className="text-ink">
                    <span className="font-medium">{k}</span> <span className="text-slate2">{v}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 lg:mt-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a href="/#start" className="btn btn-primary group">
                Projekt starten
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
                Erstgespräch buchen
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        <a href="/#so-funktionierts" className="mt-16 inline-flex items-center gap-2 text-sm text-slate2 hover:text-ink transition-colors">
          Mehr zum Portal, zu den Paketen und unseren Projekten
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
