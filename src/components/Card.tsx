export default function Card({
  children,
  className = "",
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 transition-colors duration-200 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
