// Copy for the portal-centred site (Till, 06.10.2026). Every claim matches the portal and the
// explainer film: approvals at every step, payment only after the video approval, «bis zu fünf
// Kurzvideos», «Monatsbericht», campaigns are optimised (never «betreut»), ready in about a week.

export const PORTAL_URL = "https://studio.tw-services.ch";
export const BOOKING_URL = "https://termin.tw-p.ch/tw-services";
export const CONTACT = { email: "info@tw-services.ch", phone: "+41 44 505 63 72" };

export const FILM = {
  src: "/portal/tws-studio-film.mp4",
  poster: "/portal/film-poster.jpg",
  duration: "1:35",
  title: "TWS Studio in 95 Sekunden",
};

export const STEPS = [
  {
    n: "01",
    title: "Angaben in rund fünf Minuten",
    text: "Paket wählen, Projektunterlagen hochladen, Zielgruppe und Stimme bestimmen. Mehr müssen Sie nicht vorbereiten.",
    image: "/portal/schritt-1-angaben.webp",
    alt: "Portal, Schritt Stimme: vier Sprecherstimmen zur Auswahl mit Hörprobe",
  },
  {
    n: "02",
    title: "Den Rest machen wir",
    text: "Projektvideo, Kurzvideos für Feed, Reels und Story, Anzeigentexte und eine Landingpage, die Interessenten die Unterlagen automatisch schickt.",
    image: "/portal/schritt-2-produktion.webp",
    alt: "Lieferformate: Projektvideo 16:9, Kurzvideo 9:16, Feed-Anzeige 4:5 und Landingpage",
  },
  {
    n: "03",
    title: "Sie geben frei",
    text: "Skript, Video, Landingpage und Anzeigen kommen zuerst zu Ihnen. Sie kommentieren direkt am Inhalt; live geht nur, was Sie freigeben.",
    image: "/portal/schritt-3-freigaben.webp",
    alt: "Video-Freigabe im Portal: Szene markiert, Kommentar «Lieber ab 2.5 Zimmer»",
  },
  {
    n: "04",
    title: "Die Kampagne läuft",
    text: "Ihre Anzeigen laufen auf Instagram und Facebook, wir optimieren sie laufend. Alle Anfragen sehen Sie im Portal, jeden Monat erhalten Sie einen Bericht.",
    image: "/portal/schritt-4-kampagne.webp",
    alt: "Kampagne im Portal: Anfragen mit Einheit, Zeithorizont, Eigenmittel und Status",
  },
];

export const APPROVALS = [
  { title: "Skript", text: "Szenen, Texte im Bild, Sprechtext und Fakten. Sie korrigieren direkt im Text." },
  { title: "Projektvideo", text: "Szene für Szene, mit Zeitmarke. Bis zur Zahlung mit Wasserzeichen." },
  { title: "Landingpage", text: "Abschnitt für Abschnitt am Handy und am Computer, inklusive Test-Anfrage." },
  { title: "Anzeigen", text: "Kurzvideos auswählen, Anzeigentexte anpassen, Startdatum wählen." },
];

export type PackageId = "video" | "video-lp" | "video-kampagne" | "vollsystem";

export const PACKAGES: { id: PackageId; name: string; summary: string }[] = [
  { id: "video", name: "Video", summary: "Projektvideo mit bis zu fünf Kurzvideos." },
  { id: "video-lp", name: "Video und Landingpage", summary: "Dazu eine eigene Landingpage mit Anfrageformular." },
  { id: "video-kampagne", name: "Video und Kampagne", summary: "Dazu eine Meta-Kampagne, die Anfragen auf Ihre Website führt." },
  { id: "vollsystem", name: "Vollsystem", summary: "Video, Landingpage und Kampagne aus einer Hand." },
];

// Which package includes what; rows read as one comparison.
export const FEATURES: { label: string; detail?: string; in: PackageId[] }[] = [
  { label: "Projektvideo", detail: "16:9 und 9:16", in: ["video", "video-lp", "video-kampagne", "vollsystem"] },
  { label: "Bis zu fünf Kurzvideos", detail: "9:16 und 4:5", in: ["video", "video-lp", "video-kampagne", "vollsystem"] },
  { label: "Projekt-Landingpage", detail: "mit Anfrageformular", in: ["video-lp", "vollsystem"] },
  { label: "Vorqualifizierte Anfragen", detail: "Unterlagen gehen automatisch raus", in: ["video-lp", "vollsystem"] },
  { label: "Alle Anfragen im Portal", detail: "mit Status und Notizen", in: ["video-lp", "vollsystem"] },
  { label: "Meta-Kampagne", detail: "Instagram und Facebook, laufend optimiert", in: ["video-kampagne", "vollsystem"] },
  { label: "Monatsbericht als PDF", in: ["video-kampagne", "vollsystem"] },
  { label: "Ihre Freigabe bei jedem Schritt", in: ["video", "video-lp", "video-kampagne", "vollsystem"] },
  { label: "Zahlung erst nach Freigabe des Videos", in: ["video", "video-lp", "video-kampagne", "vollsystem"] },
];
