export default function Header() {
  return (
    <header className="flex w-full justify-between gap-4 pt-6 pb-4 font-mono text-xs text-fg-soft sm:pt-8 sm:pb-6 sm:text-sm">
      <p>zsombor.dev</p>
      <p>{new Date().toDateString()}</p>
    </header>
  );
}
