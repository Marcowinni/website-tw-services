import { useEffect, useState } from "react";

import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { PORTAL_URL } from "../content/portal";

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // In Astro every nav click triggers a full page reload, so the drawer
  // closes naturally — no useLocation-based effect needed.

  const navItems = [
    { name: "Portal", href: "/#so-funktionierts" },
    { name: "Pakete", href: "/#pakete" },
    { name: t.header.nav.references, href: "/#references" },
    { name: t.header.nav.about, href: "/#about" },
    { name: t.header.nav.contact, href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* TOP-STRIP — Cross-link to sister company TW Projects */}
      <div className="bg-ink text-cloud border-b border-ink-soft">
        <div className="container-x flex items-center justify-between gap-4 h-9 sm:h-10">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-eyebrow font-semibold text-cloud/60 hidden sm:inline">
            TW Projects
          </span>
          <a
            href="https://www.tw-p.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] sm:text-xs text-cloud/85 hover:text-cloud transition-colors duration-300"
          >
            <span className="hidden sm:inline">Mit KI effizienter arbeiten — </span>
            <span className="sm:hidden">KI-Workflows entdecken — </span>
            <span className="font-medium underline underline-offset-2 decoration-cloud/30 group-hover:decoration-cloud">
              tw-p.ch
            </span>
            <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* PRIMARY NAV */}
      <div
        className={`transition-all duration-300 ease-out-quart ${
          scrolled
            ? "bg-cloud/90 backdrop-blur-md border-b border-line"
            : "bg-cloud/95 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="container-x flex items-center justify-between h-[64px] sm:h-[72px]">
          <a href="/" className="flex items-center gap-2.5 group" aria-label="TW Services Startseite">
            <img
              src="/logo.png"
              alt="TW Services"
              className="h-9 w-auto transition-transform duration-500 ease-out-expo group-hover:scale-105"
            />
            <span className="font-semibold text-ink tracking-tight text-[15px] hidden sm:inline-block">
              TW Services
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate2 hover:text-ink transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute left-0 right-0 -bottom-1 h-px bg-ink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href={PORTAL_URL} className="hidden lg:inline-flex text-sm font-medium text-slate2 hover:text-ink transition-colors duration-200">
              Kundenlogin
            </a>
            <a
              href="/#start"
              className="hidden sm:inline-flex items-center gap-2 bg-ink text-cloud px-5 py-2.5 text-[13px] font-medium rounded-full hover:bg-navy transition-all duration-300 ease-out-quart"
            >
              Projekt starten
              <span aria-hidden>→</span>
            </a>

            <button
              type="button"
              className="md:hidden p-2 -mr-2 text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Menü schliessen" : "Menü öffnen"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out-quart border-t ${
            open ? "max-h-[36rem] opacity-100 border-line" : "max-h-0 opacity-0 border-transparent"
          } bg-cloud`}
        >
          <nav className="container-x py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-base font-medium text-ink py-3 border-b border-line-soft hover:text-navy transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a href={PORTAL_URL} className="text-base font-medium text-ink py-3 border-b border-line-soft hover:text-navy transition-colors">
              Kundenlogin
            </a>
            <a
              href="/#start"
              className="mt-3 inline-flex items-center justify-center gap-2 bg-ink text-cloud px-5 py-3.5 text-sm font-medium rounded-full"
            >
              Projekt starten <span aria-hidden>→</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
