import Card from "./components/Card";
import LocalTime from "./components/LocalTime";
import Header from "./components/Header";
import TechBadge from "./components/TechBadge";
import Projects from "./components/Projects";
import { useEffect, useRef, useState } from "react";
import { STACK, SOCIALS, BACKGROUND } from "./lib/CONSTANTS";

type Phase = "closed" | "opening" | "open" | "closing";

function App() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [areaHeight, setAreaHeight] = useState(0);
  const [hideGrid, setHideGrid] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const openProjects = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => {
      setHideGrid(true);
      setPhase("open");
    }, 110);
  };

  const closeProjects = () => {
    if (phase !== "open") return;
    setPhase("closing");
    window.setTimeout(() => {
      setHideGrid(false);
      requestAnimationFrame(() => setPhase("closed"));
    }, 110);
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

  // Track the projects view's height while it is mounted so the page reserves
  // exactly that much room once the home cards are taken out of layout.
  const mounted = phase !== "closed";
  useEffect(() => {
    if (!mounted) return;
    const content = contentRef.current;
    if (!content) return;
    const update = () => setAreaHeight(content.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [mounted]);

  const expanded = phase === "open";
  const ease = "cubic-bezier(.16,1,.3,1)";

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-4 pb-10 sm:px-6 xl:w-3/5 xl:px-0">
        <Header />
        <main
          className="relative"
          style={{
            minHeight: phase !== "closed" ? areaHeight : undefined,
            transition: `min-height .35s ${ease}`,
          }}
        >
          {phase !== "closed" && (
            <div
              className="absolute top-0 left-0 z-50 w-full"
              style={{ pointerEvents: expanded ? "auto" : "none" }}
            >
              <div
                ref={contentRef}
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded
                    ? "none"
                    : "translateY(10px) scale(0.995)",
                  transition: `opacity ${expanded ? ".3s" : ".12s"} ${ease}, transform .4s ${ease}`,
                }}
              >
                <Projects onClose={closeProjects} />
              </div>
            </div>
          )}
          <div
            className="grid grid-cols-1 gap-4 transition-[opacity,transform] duration-100 lg:grid-cols-9"
            style={{
              opacity: phase === "closed" ? 1 : 0,
              transform: phase === "closed" ? "none" : "scale(0.995)",
              display: hideGrid ? "none" : undefined,
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-[1fr_auto] lg:col-span-6">
              <Card className="view-rise flex flex-col justify-between gap-6 hover:border-border-hover sm:col-span-2">
                <p className="font-mono text-xs tracking-wider text-accent uppercase">
                  Full-stack developer
                </p>
                <h1 className="text-5xl leading-[0.95] font-semibold tracking-tighter text-text sm:text-6xl xl:text-7xl">
                  Zsombor Kovács
                </h1>
              </Card>
              {BACKGROUND.map((group, i) => (
                <Card
                  key={group.label}
                  className="view-rise flex flex-col justify-between gap-6 hover:border-border-hover"
                  style={{ animationDelay: `${40 + i * 40}ms` }}
                >
                  <p className="font-mono text-xs tracking-wider text-text-label uppercase">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-4">
                    {group.items.map((item) => (
                      <div key={item.title} className="flex flex-col gap-0.5">
                        <p className="text-xl leading-tight font-semibold tracking-tight text-balance text-text">
                          {item.title}
                        </p>
                        <p className="text-sm text-text-muted sm:text-base">
                          {item.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            <Card
              className="view-rise hover:border-border-hover lg:col-span-3"
              style={{ animationDelay: "60ms" }}
            >
              <div className="flex justify-between font-mono text-xs tracking-wider text-text-label uppercase">
                <p>Stack &amp; tools</p>
                <p>Daily drivers</p>
              </div>
              <div className="mt-4 flex flex-col gap-3.5">
                {STACK.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1.5 text-xs text-text-muted">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <TechBadge key={item} name={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card
              className="view-rise hover:border-border-hover lg:col-span-3"
              style={{ animationDelay: "100ms" }}
            >
              <LocalTime />
            </Card>
            <div className="grid grid-cols-1 gap-4 lg:col-span-6 lg:grid-cols-6 lg:grid-rows-[auto_1fr]">
              {SOCIALS.map((social, i) => (
                <Card
                  key={social.name}
                  className="view-rise group p-4! hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/5 hover:shadow-lift lg:col-span-2"
                  style={{ animationDelay: `${80 + i * 40}ms` }}
                >
                  <a
                    href={social.href}
                    target={
                      social.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noreferrer"
                    className="flex flex-col gap-1 outline-none focus-visible:ring-2 focus-visible:ring-text/40"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-text">{social.name}</p>
                      <span
                        aria-hidden
                        className="text-text-label transition-[color,translate] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="truncate font-mono text-sm text-accent">
                      {social.handle}
                    </p>
                  </a>
                </Card>
              ))}
              <Card
                className="view-rise group overflow-hidden p-0! hover:border-accent/60 hover:bg-accent/5 hover:shadow-lift has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-text/40 lg:col-span-6"
                style={{
                  animationDelay: "200ms",
                  backgroundImage:
                    "radial-gradient(120% 120% at 100% 0%, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent 60%)",
                }}
              >
                <button
                  type="button"
                  onClick={openProjects}
                  className="flex h-full w-full cursor-pointer flex-col p-6 text-left outline-none"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-4xl leading-[0.9] font-semibold tracking-tighter text-text sm:text-5xl">
                      Projects
                    </p>
                    <span
                      aria-hidden
                      className="text-xl text-accent transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </div>
                  <p className="mt-auto max-w-lg pt-4 leading-relaxed text-text-muted">
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
