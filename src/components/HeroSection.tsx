import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { FilmPlayer } from "./FilmPlayer";

const ease = [0.16, 1, 0.3, 1] as const;

// The portal is the product: one sentence of promise, one clear next step, and the film that shows
// the whole way from upload to running campaign.
export function HeroSection() {
  return (
    <section id="portal" className="relative overflow-hidden pt-[136px] sm:pt-[160px] pb-section-y-sm">
      <div className="container-x relative">
        <div className="grid grid-cols-12 gap-x-6 lg:gap-x-10 gap-y-10">
          <div className="col-span-12 lg:col-span-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="eyebrow mb-7">
              <span>TWS Studio · Vermarktung für Neubauprojekte</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.05, ease }}
              className="h-display text-balance"
            >
              Wir verkaufen Neubauprojekte, <em className="font-display italic text-navy">bevor der Bagger kommt.</em>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="col-span-12 lg:col-span-5 order-2 flex flex-col justify-end"
          >
            <p className="text-lg sm:text-xl text-slate2 leading-relaxed text-pretty max-w-prose-lg">
              Projektvideo, Anzeigen auf Instagram und Facebook, Landingpage und Kampagne für Ihr Neubauprojekt.
              Sie laden Ihre Unterlagen ins Portal, wir machen den Rest, und{" "}
              <span className="text-ink font-medium">nichts geht ohne Ihre Freigabe live.</span>
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/#start" className="btn btn-primary group">
                Projekt starten
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="/#so-funktionierts" className="btn btn-ghost">
                So funktioniert's
              </a>
            </div>
            <ul className="mt-10 grid gap-2.5 border-t border-line pt-6 text-sm text-slate2">
              {["In rund einer Woche startklar", "Rund fünf Minuten Aufwand für Ihre Angaben", "Zahlung erst, wenn Ihnen das Projektvideo gefällt"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0 text-navy" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="col-span-12 lg:col-span-7 order-1"
          >
            <FilmPlayer priority />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
