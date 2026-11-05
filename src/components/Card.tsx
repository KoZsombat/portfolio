export default function Card({
  children,
  className = "",
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`rounded-xl border border-line bg-card p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
