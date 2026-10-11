export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-card p-6 ${className}`}
    >
      {children}
    </div>
  );
}
