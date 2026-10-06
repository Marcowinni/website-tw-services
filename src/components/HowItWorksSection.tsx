import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STEPS } from "../content/portal";

// Four steps as a scroll story: the text column scrolls, the portal screen stays in place and
// changes with the step in focus. On small screens each step carries its own screen.
export function HowItWorksSection() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="so-funktionierts" className="py-section-y border-t border-line bg-cloud-warm">
      <div className="container-x">
        <div className="eyebrow mb-6">
          <span>So funktioniert's</span>
        </div>
        <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance max-w-4xl">
          Ein Portal, <em className="italic text-navy">vier Schritte.</em>
        </h2>

        <div className="mt-14 lg:mt-20 grid grid-cols-12 gap-x-6 lg:gap-x-12">
          <ol className="col-span-12 lg:col-span-5">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className="lg:min-h-[62vh] flex flex-col justify-center py-10 lg:py-0 border-t border-line lg:border-0"
              >
                <div
                  className={`transition-opacity duration-500 ease-out-quart ${active === i ? "lg:opacity-100" : "lg:opacity-35"}`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-sans text-sm font-semibold tabular-nums text-navy">{s.n}</span>
                    <h3 className="font-display text-3xl sm:text-4xl leading-tight text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-4 pl-9 text-lg text-slate2 leading-relaxed max-w-prose-lg text-pretty">{s.text}</p>
                </div>
                <motion.img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:hidden mt-8 w-full border border-line shadow-lift"
                />
              </li>
            ))}
          </ol>

          <div className="hidden lg:block col-span-7">
            <div className="sticky top-[max(8.5rem,calc(50vh-min(26vw,330px)))]">
              <div className="relative aspect-[1112/790] border border-line bg-cloud shadow-lift overflow-hidden">
                {STEPS.map((s, i) => (
                  <img
                    key={s.n}
                    src={s.image}
                    alt={active === i ? s.alt : ""}
                    aria-hidden={active !== i}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-out-expo"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "scale(1)" : "scale(1.015)",
                      filter: active === i ? "none" : "blur(4px)",
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-1.5" aria-hidden>
                {STEPS.map((s, i) => (
                  <span key={s.n} className="h-[3px] flex-1 bg-line overflow-hidden">
                    <span
                      className="block h-full bg-navy transition-transform duration-700 ease-out-expo origin-left"
                      style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
