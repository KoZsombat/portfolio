import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Card from "./Card";
import TechBadge from "./TechBadge";
import { PROJECTS as ALL } from "../lib/CONSTANTS";

const PROJECTS = ALL.filter((p) => p.pinned);

// Bento layout on a 6-column grid, three rows of equal height.
// Row 1: 4 + 2, row 2: 2 + 4, row 3: 4 + 2 (GitHub link card).
const SPANS = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-4",
  "md:col-span-4",
];

const WIDE = new Set(["md:col-span-4"]);

// Shows as many lines of text as the available (fixed) height can hold.
function FitText({ children }: { children: string }) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const [fit, setFit] = useState({ lines: 1, height: 0 });

  useLayoutEffect(() => {
    const b = box.current;
    const t = text.current;
    if (!b || !t) return;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(t).lineHeight);
      if (lh > 0) {
        const lines = Math.max(1, Math.floor(b.clientHeight / lh));
        setFit({ lines, height: lines * lh });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative min-h-0 flex-1">
      <p
        ref={text}
        className="absolute inset-x-0 top-0 leading-relaxed text-fg-muted"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: fit.lines,
          height: fit.height || undefined,
          overflow: "hidden",
        }}
      >
        {children}
      </p>
    </div>
  );
}

type Project = (typeof PROJECTS)[number];

function Carousel({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((c) => (c + d + n) % n);

  useEffect(() => {
    if (n < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (n === 0) return null;

  const arrow =
    "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-card/80 text-fg backdrop-blur transition-colors hover:border-line-hover hover:bg-card";

  return (
    <div className="relative h-72 shrink-0 border-b border-line bg-thumb">
      <img
        key={i}
        src={images[i]}
        alt={`${name} screenshot ${i + 1} of ${n}`}
        className="h-full w-full object-contain"
      />
      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className={`${arrow} left-3`}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className={`${arrow} right-3`}
          >
            →
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((_, d) => (
              <button
                key={d}
                type="button"
                aria-label={`Show image ${d + 1}`}
                onClick={() => setI(d)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  d === i ? "w-5 bg-fg" : "w-1.5 bg-fg-faint hover:bg-fg-muted"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectDialog({
  project,
  from,
  onClose,
}: {
  project: Project;
  from: DOMRect;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);

  // Grow out of the clicked card on open, shrink back into it on close.
  const frames = (d: HTMLDialogElement): Keyframe[] => {
    const r = d.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (r.left + r.width / 2);
    const dy = from.top + from.height / 2 - (r.top + r.height / 2);
    const scale = Math.max(0.25, Math.min(1, from.width / r.width));
    return [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
      { transform: "none", opacity: 1 },
    ];
  };
  const timing = { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" };

  useEffect(() => {
    const d = ref.current;
    if (!d || d.open) return;
    d.showModal();
    d.animate(frames(d), timing);
    try {
      d.animate([{ opacity: 0 }, { opacity: 1 }], {
        ...timing,
        pseudoElement: "::backdrop",
      });
    } catch {
      /* ::backdrop animation unsupported, skip */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestClose = () => {
    const d = ref.current;
    if (!d || closing.current) return;
    closing.current = true;
    const anim = d.animate(frames(d), {
      ...timing,
      duration: 260,
      direction: "reverse",
      fill: "forwards",
    });
    try {
      d.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 260,
        direction: "reverse",
        fill: "forwards",
        pseudoElement: "::backdrop",
      });
    } catch {
      /* skip */
    }
    anim.finished.then(() => d.close()).catch(() => d.close());
  };

  const liveHref = project.live
    ? project.live.startsWith("http")
      ? project.live
      : `https://${project.live}`
    : "";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className="m-auto max-h-[85vh] w-[min(44rem,calc(100%-2rem))] overflow-hidden rounded-xl border border-line bg-card p-0 text-fg backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] flex-col overflow-y-auto">
        <Carousel images={project.images} name={project.name} />
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-3xl leading-none font-semibold tracking-tight">
              {project.name}
            </h2>
            <button
              type="button"
              onClick={requestClose}
              autoFocus
              aria-label="Close"
              className="cursor-pointer rounded-chip border border-line-strong px-3 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-line-hover hover:text-fg"
            >
              Close ✕
            </button>
          </div>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <TechBadge key={t} name={t} size="xs" />
              ))}
            </div>
          )}

          <div>
            <p className="mb-1.5 font-mono text-xs tracking-wider text-fg-faint uppercase">
              What it does
            </p>
            <p className="leading-relaxed text-fg-muted">
              {project.description}
            </p>
          </div>

          {project.role && (
            <div>
              <p className="mb-1.5 font-mono text-xs tracking-wider text-fg-faint uppercase">
                What I did
              </p>
              <p className="leading-relaxed text-fg-muted">{project.role}</p>
            </div>
          )}

          {(project.repo || liveHref) && (
            <div className="flex gap-3 pt-1 font-mono text-sm">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-chip border border-line-strong px-3 py-1 text-fg transition-colors hover:border-line-hover"
                >
                  GitHub ↗
                </a>
              )}
              {liveHref && (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-chip border border-line-strong px-3 py-1 text-fg transition-colors hover:border-line-hover"
                >
                  Live ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default function Projects({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<{
    project: Project;
    from: DOMRect;
  } | null>(null);
  const open = (p: Project, el: HTMLElement) =>
    setSelected({ project: p, from: el.getBoundingClientRect() });
  const backClass =
    "group flex items-center justify-center gap-3 rounded-xl border border-line bg-card px-4 py-4 text-3xl leading-none font-semibold tracking-tight text-fg-muted transition-colors hover:border-line-hover hover:bg-card-hover hover:text-fg sm:text-4xl";
  const backInner = (
    <>
      <span
        aria-hidden
        className="leading-none transition-transform group-hover:-translate-x-1"
      >
        ←
      </span>
      Back
    </>
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <button type="button" onClick={onClose} className={backClass}>
          {backInner}
        </button>
        <Card className="col-span-2 flex items-center justify-between gap-4 px-6! py-4!">
          <h1 className="text-3xl leading-none font-semibold tracking-tight text-fg sm:text-4xl">
            Projects
          </h1>
          <span className="rounded-chip border border-line-strong px-2.5 py-0.5 font-mono text-xs text-fg-muted">
            {PROJECTS.length} projects
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:auto-rows-[clamp(11rem,calc((100vh-15rem)/3),14rem)] md:grid-cols-6">
        {PROJECTS.map((p, i) => (
          <Card
            key={p.name}
            role="button"
            tabIndex={0}
            onClick={(e) => open(p, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(p, e.currentTarget);
              }
            }}
            className={`cursor-pointer flex-col overflow-hidden p-0! transition-colors hover:border-line-hover hover:bg-card-hover ${SPANS[i % SPANS.length]} flex ${
              WIDE.has(SPANS[i % SPANS.length]) ? "md:flex-row" : ""
            }`}
          >
            <div
              className={`shrink-0 overflow-hidden border-b border-line md:border-b-0 ${
                WIDE.has(SPANS[i % SPANS.length])
                  ? "h-1/4 min-h-12 md:h-auto md:w-1/3 md:border-r"
                  : "h-1/4 min-h-12 md:border-b"
              }`}
            >
              {p.images[0] ? (
                <img
                  src={p.images[0]}
                  alt={`${p.name} preview`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-card-hover font-mono text-sm tracking-wider text-fg-faint">
                  {p.name}
                </div>
              )}
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="truncate text-2xl font-semibold tracking-tight text-fg">
                  {p.name}
                </h2>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-xs text-fg-faint"
                >
                  Details ↗
                </span>
              </div>
              <FitText>{p.description}</FitText>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                {p.tags.map((t) => (
                  <TechBadge key={t} name={t} size="xs" />
                ))}
              </div>
            </div>
          </Card>
        ))}
        <a
          href="https://github.com/KoZsombat"
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col justify-between gap-2 rounded-xl border border-line bg-card p-4 transition-colors hover:border-line-hover hover:bg-card-hover md:col-span-2"
        >
          <p className="font-mono text-xs tracking-wider text-fg-faint uppercase">
            More
          </p>
          <p className="flex items-end justify-between text-xl font-semibold tracking-tight text-fg">
            GitHub
            <span
              aria-hidden
              className="text-fg-faint transition-[color,translate] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-fg"
            >
              ↗
            </span>
          </p>
        </a>
      </div>
      {selected && (
        <ProjectDialog
          project={selected.project}
          from={selected.from}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
