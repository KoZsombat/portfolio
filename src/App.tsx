import Card from "./components/Card";
import LocalTime from "./components/LocalTime";
import Header from "./components/Header";
import TechBadge from "./components/TechBadge";
import Projects from "./components/Projects";
import { useEffect, useRef, useState } from "react";
import { STACK, SOCIALS, BACKGROUND } from "./lib/CONSTANTS";

type Phase = "closed" | "opening" | "open" | "closing";
type Box = { top: number; left: number; width: number; height: number };

function App() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [from, setFrom] = useState<Box | null>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });
  const mainRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // The trigger's box, relative to <main>, which the overlay is anchored to.
  const measureFrom = (): Box | null => {
    if (!mainRef.current || !triggerRef.current) return null;
    const m = mainRef.current.getBoundingClientRect();
    const t = triggerRef.current.getBoundingClientRect();
    return {
      top: t.top - m.top,
      left: t.left - m.left,
      width: t.width,
      height: t.height,
    };
  };

  const openProjects = () => {
    const box = measureFrom();
    if (!box || !mainRef.current) return;
    setFrom(box);
    setArea({ width: mainRef.current.offsetWidth, height: 0 });
    setPhase("opening");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!mainRef.current) return;
        setArea({
          width: mainRef.current.offsetWidth,
          height:
            contentRef.current?.offsetHeight ?? mainRef.current.offsetHeight,
        });
        setPhase("open");
      }),
    );
  };

  const closeProjects = () => {
    if (phase !== "open") return;
    // The home cards are out of layout while expanded; bring them back first
    // so the trigger has a real position to shrink into.
    setHideGrid(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const box = measureFrom();
        if (box && box.width > 0) setFrom(box);
        setPhase("closing");
        window.setTimeout(() => setPhase("closed"), 450);
      }),
    );
  };

  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]"))
        closeProjects();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Keep the expanded area exactly as tall as the projects content.
  useEffect(() => {
    if (phase !== "open" || !contentRef.current || !mainRef.current) return;
    const content = contentRef.current;
    const update = () =>
      setArea((a) => ({
        ...a,
        height: content.offsetHeight,
      }));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [phase]);

  // Once expanded, take the home cards out of layout so the page is only as
  // tall as the projects view.
  const [hideGrid, setHideGrid] = useState(false);
  useEffect(() => {
    if (phase !== "open") {
      setHideGrid(false);
      return;
    }
    const t = window.setTimeout(() => setHideGrid(true), 480);
    return () => window.clearTimeout(t);
  }, [phase]);

  const expanded = phase === "open";
  const ease = "cubic-bezier(.2,.8,.2,1)";

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-4 pb-10 sm:px-6 xl:w-3/5 xl:px-0">
        <Header />
        <main
          ref={mainRef}
          className="relative"
          style={{
            minHeight: expanded ? area.height + 2 : undefined,
            transition: `min-height .45s ${ease}`,
          }}
        >
          {phase !== "closed" && from && (
            <div
              className="absolute z-50 overflow-hidden border"
              style={{
                top: expanded ? 0 : from.top,
                left: expanded ? 0 : from.left,
                width: expanded ? "100%" : from.width,
                height: expanded ? area.height + 2 : from.height, // +2 for the border
                borderRadius: 12,
                backgroundColor: expanded ? "transparent" : "var(--color-card)",
                borderColor: expanded ? "transparent" : "var(--color-line)",
                transition: `top .45s ${ease}, left .45s ${ease}, width .45s ${ease}, height .45s ${ease}, background-color .45s, border-color .45s`,
              }}
            >
              <div
                className="absolute inset-0 flex flex-col p-6 transition-opacity duration-200"
                style={{ opacity: expanded ? 0 : 1 }}
                aria-hidden
              >
                <p className="text-4xl leading-[0.9] font-semibold tracking-tighter text-fg sm:text-5xl">
                  Projects
                </p>
                <p className="mt-auto max-w-lg pt-4 leading-relaxed text-fg-muted">
                  Pinned and recent work from my GitHub.
                </p>
              </div>
              <div
                ref={contentRef}
                className="absolute top-0 left-0 transition-opacity duration-300"
                style={{
                  width: Math.max(0, area.width - 2), // minus the overlay border
                  opacity: expanded ? 1 : 0,
                  transitionDelay: expanded ? "0.25s" : "0s",
                  pointerEvents: expanded ? "auto" : "none",
                }}
              >
                <Projects onClose={closeProjects} />
              </div>
            </div>
          )}
          <div
            className="grid grid-cols-1 gap-4 transition-opacity duration-300 lg:grid-cols-9"
            style={{
              opacity: expanded ? 0 : 1,
              display: hideGrid ? "none" : undefined,
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-[1fr_auto] lg:col-span-6">
              <Card className="flex flex-col justify-between gap-6 sm:col-span-2">
                <p className="font-mono text-xs tracking-wider text-fg-faint uppercase">
                  Full-stack developer
                </p>
                <h1 className="text-5xl leading-[0.95] font-semibold tracking-tighter text-fg sm:text-6xl xl:text-7xl">
                  Kovács Zsombor
                </h1>
              </Card>
              {BACKGROUND.map((group) => (
                <Card
                  key={group.label}
                  className="flex flex-col justify-between gap-6"
                >
                  <p className="font-mono text-xs tracking-wider text-fg-faint uppercase">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-4">
                    {group.items.map((item) => (
                      <div key={item.title} className="flex flex-col gap-0.5">
                        <p className="text-xl leading-tight font-semibold tracking-tight text-balance text-fg">
                          {item.title}
                        </p>
                        <p className="text-sm text-fg-muted sm:text-base">
                          {item.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            <Card className="lg:col-span-3">
              <div className="flex justify-between font-mono text-xs tracking-wider text-fg-faint uppercase">
                <p>Stack &amp; tools</p>
                <p>Daily drivers</p>
              </div>
              <div className="mt-4 flex flex-col gap-3.5">
                {STACK.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1.5 text-xs text-fg-muted">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <TechBadge
                          key={item}
                          name={item}
                          colored={group.label === "Languages"}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="lg:col-span-3">
              <LocalTime />
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:col-span-6 lg:grid-cols-6 lg:grid-rows-[auto_1fr]">
              {SOCIALS.map((social) => (
                <Card key={social.name} className="p-4! lg:col-span-2">
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noreferrer"
                    className="group flex flex-col gap-1"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-fg">{social.name}</p>
                      <span
                        aria-hidden
                        className="transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: social.color }}
                      >
                        ↗
                      </span>
                    </div>
                    <p
                      className="truncate font-mono text-sm"
                      style={{ color: social.color }}
                    >
                      {social.handle}
                    </p>
                  </a>
                </Card>
              ))}
              <Card className="p-0! lg:col-span-6">
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={openProjects}
                  className="group flex h-full w-full cursor-pointer flex-col p-6 text-left transition-colors hover:bg-card-hover rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-4xl leading-[0.9] font-semibold tracking-tighter text-fg sm:text-5xl">
                      Projects
                    </p>
                    <span
                      aria-hidden
                      className="text-xl text-fg-faint transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="mt-auto max-w-lg pt-4 leading-relaxed text-fg-muted">
                    Pinned and recent work from my GitHub.
                  </p>
                </button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
