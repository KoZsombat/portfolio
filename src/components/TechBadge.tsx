// Brand / GitHub-linguist colours for the technologies shown as badges.
const COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Go: "#00add8",
  "C#": "#178600",
  Rust: "#dea584",
  React: "#61dafb",
  Svelte: "#ff3e00",
  "Tailwind CSS": "#38bdf8",
  "Node.js": "#5fa04e",
  Express: "#a3a3a3",
  NestJS: "#e0234e",
  "Go (net/http)": "#00add8",
  "Socket.IO": "#c4c4c4",
  Axum: "#dea584",
  Docker: "#2496ed",
  Git: "#f05032",
  "Next.js": "#e5e5e5",
};

// "React 19" -> "React", "Next.js 16" -> "Next.js"
const baseName = (name: string) => name.replace(/\s+\d+(\.\d+)*$/, "");

export default function TechBadge({
  name,
  size = "sm",
  colored = true,
}: {
  name: string;
  size?: "xs" | "sm";
  colored?: boolean;
}) {
  const color = colored ? (COLORS[name] ?? COLORS[baseName(name)]) : undefined;
  const sizing =
    size === "xs"
      ? "px-2 py-px text-xs gap-1.5"
      : "px-2.5 py-0.5 text-sm gap-2";

  return (
    <span
      className={`inline-flex items-center rounded-chip border text-fg ${sizing} ${
        color ? "" : "border-line-strong"
      }`}
      style={
        color
          ? {
              borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
            }
          : undefined
      }
    >
      {color && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {name}
    </span>
  );
}
