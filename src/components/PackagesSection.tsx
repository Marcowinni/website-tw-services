import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { FEATURES, PACKAGES, type PackageId } from "../content/portal";

// Packages without prices (Till, 06.10.2026): one comparison table on wide screens, a package
// switcher with the same rows on phones. Each column ends in «Projekt starten» with the package
// preselected in the start form.
export function PackagesSection() {
  const [mobile, setMobile] = useState<PackageId>("vollsystem");

  return (
    <section id="pakete" className="py-section-y border-t border-line bg-cloud-warm">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="eyebrow mb-6">
              <span>Pakete</span>
            </div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              So viel Vermarktung, <em className="italic text-navy">wie Ihr Projekt braucht.</em>
            </h2>
          </div>
          <p className="col-span-12 lg:col-span-5 text-lg text-slate2 leading-relaxed">
            Sie wählen das Paket im Portal. Den Preis erhalten Sie mit Ihrer Offerte; das Werbebudget für die Kampagne kommt separat dazu.
          </p>
        </div>

        {/* wide screens: comparison table */}
        <div className="hidden md:block mt-16 overflow-hidden border border-line bg-cloud">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Leistungen der vier Pakete im Vergleich</caption>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="w-[30%] p-6 lg:p-8 text-sm font-medium text-slate2">Enthalten</th>
                {PACKAGES.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className={`p-6 lg:p-8 font-normal ${p.id === "vollsystem" ? "bg-navy text-cloud" : "text-ink"}`}
                  >
                    <span className="block font-display text-2xl leading-tight">{p.name}</span>
                    <span className={`mt-2 block text-sm leading-snug ${p.id === "vollsystem" ? "text-cloud/75" : "text-slate2"}`}>{p.summary}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label} className="border-t border-line">
                  <th scope="row" className="px-6 lg:px-8 py-4 font-normal">
                    <span className="block text-ink">{f.label}</span>
                    {f.detail && <span className="block text-sm text-slate2">{f.detail}</span>}
                  </th>
                  {PACKAGES.map((p) => {
                    const yes = f.in.includes(p.id);
                    return (
                      <td key={p.id} className={`px-6 lg:px-8 py-4 ${p.id === "vollsystem" ? "bg-navy-50" : ""}`}>
                        {yes ? (
                          <Check className="h-5 w-5 text-navy" strokeWidth={1.75} aria-label="enthalten" />
                        ) : (
                          <Minus className="h-5 w-5 text-line-strong" strokeWidth={1.5} aria-label="nicht enthalten" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-line">
                <td className="px-6 lg:px-8 py-6" />
                {PACKAGES.map((p) => (
                  <td key={p.id} className={`px-4 lg:px-6 py-6 ${p.id === "vollsystem" ? "bg-navy-50" : ""}`}>
                    <a
                      href={`/?paket=${p.id}#start`}
                      className={`btn w-full !px-3 whitespace-nowrap ${p.id === "vollsystem" ? "btn-primary" : "btn-ghost"}`}
                      aria-label={`Projekt starten mit Paket ${p.name}`}
                    >
                      Projekt starten
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* phones: package switcher */}
        <div className="md:hidden mt-12">
          <div role="tablist" aria-label="Paket wählen" className="grid grid-cols-2 gap-2">
            {PACKAGES.map((p) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={mobile === p.id}
                onClick={() => setMobile(p.id)}
                className={`min-h-[48px] px-3 text-sm font-medium border transition-colors duration-200 ${
                  mobile === p.id ? "bg-ink text-cloud border-ink" : "bg-cloud text-ink border-line"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="mt-4 border border-line bg-cloud p-6">
            <p className="text-slate2">{PACKAGES.find((p) => p.id === mobile)!.summary}</p>
            <ul className="mt-5">
              {FEATURES.map((f) => {
                const yes = f.in.includes(mobile);
                return (
                  <li key={f.label} className={`flex gap-3 border-t border-line py-3 ${yes ? "" : "opacity-45"}`}>
                    {yes ? (
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-navy" strokeWidth={1.75} aria-label="enthalten" />
                    ) : (
                      <Minus className="mt-0.5 h-5 w-5 shrink-0 text-slate2" strokeWidth={1.5} aria-label="nicht enthalten" />
                    )}
                    <span>
                      <span className="block text-ink">{f.label}</span>
                      {f.detail && <span className="block text-sm text-slate2">{f.detail}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
            <a href={`/?paket=${mobile}#start`} className="btn btn-primary mt-6 w-full">
              Projekt starten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
