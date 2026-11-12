export default function TechBadge({
  name,
  size = "sm",
}: {
  name: string;
  size?: "xs" | "sm";
}) {
  const sizing =
    size === "xs"
      ? "px-2 py-px text-xs"
      : "px-2.5 py-0.5 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-chip border border-border bg-transparent text-text ${sizing}`}
    >
      {name}
    </span>
  );
}
