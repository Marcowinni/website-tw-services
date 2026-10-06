import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { FILM } from "../content/portal";

// The explainer film behind a poster. It never starts on its own: one click plays it with sound
// (subtitles are burned in, so it also works muted). After the first play the native controls take
// over, so pausing, seeking and fullscreen behave as people expect.
export function FilmPlayer({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.muted = false;
    void v.play();
  };

  return (
    <div className={`relative aspect-video overflow-hidden bg-ink shadow-lift ${className}`}>
      <video
        ref={videoRef}
        src={FILM.src}
        poster={FILM.poster}
        preload={priority ? "metadata" : "none"}
        playsInline
        controls={started}
        controlsList="nodownload"
        aria-label={FILM.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 flex items-end justify-start p-5 sm:p-7 text-left"
          aria-label={`${FILM.title} abspielen, ${FILM.duration} Minuten, mit Ton`}
        >
          <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 transition-opacity duration-500 group-hover:opacity-80" aria-hidden />
          <span className="relative inline-flex items-center gap-4">
            <span className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full bg-cloud text-ink shadow-lift transition-transform duration-300 ease-out-quart group-hover:scale-105 group-active:scale-95">
              <Play className="ml-1 h-5 w-5 fill-ink" />
            </span>
            <span className="text-cloud">
              <span className="block text-sm font-medium">Film ansehen</span>
              <span className="block text-xs text-cloud/75">{FILM.duration} · mit Ton und Untertiteln</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
