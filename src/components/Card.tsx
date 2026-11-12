export default function Card({
  children,
  className = "",
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 transition duration-150 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
