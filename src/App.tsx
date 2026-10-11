import Card from "./components/Card";
import LocalTime from "./components/LocalTime";

const STACK = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Go", "C#", "Kotlin"],
  },
  { label: "Frontend", items: ["React", "Tailwind CSS"] },
  { label: "Backend", items: ["Express", "NestJS"] },
  { label: "Tools", items: ["Docker", "Git"] },
];

const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/kozsombat",
    handle: "@kozsombat",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/zsombor--kovacs/",
    handle: "in/zsombor--kovacs",
  },
  {
    name: "Email",
    href: "mailto:kovacszsombor1234@gmail.com",
    handle: "kovacszsombor1234@gmail.com",
  },
];

function App() {
  const date = new Date();

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-4 pb-10 sm:px-6 xl:w-3/5 xl:px-0">
        <header className="flex w-full justify-between gap-4 pt-6 pb-4 font-mono text-xs text-fg-soft sm:pt-8 sm:pb-6 sm:text-sm">
          <p>zsombor.dev</p>
          <p>{date.toDateString()}</p>
        </header>
        <main>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-9">
            <Card className="lg:col-span-6">
              <div className="flex h-full flex-col gap-5">
                <div className="flex justify-between font-mono text-xs">
                  <p className="text-fg-soft">
                    Kovács Zsombor — Full-stack developer
                  </p>
                </div>
                <h1 className="text-6xl leading-[0.9] font-semibold tracking-tighter text-fg sm:text-7xl xl:text-8xl">
                  Working
                  <br />
                  on it.
                </h1>
                <p className="mt-auto max-w-xl text-base leading-relaxed sm:text-lg text-fg-muted">
                  I'm still building this site, so some parts are unfinished.
                  Projects, writing and ways to reach me are coming soon. Check
                  back in a little while.
                </p>
              </div>
            </Card>
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
                        <span
                          key={item}
                          className="rounded-chip border border-line-strong px-2.5 py-0.5 text-sm text-fg"
                        >
                          {item}
                        </span>
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
                        className="text-fg-faint transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="truncate font-mono text-sm text-fg-muted">
                      {social.handle}
                    </p>
                  </a>
                </Card>
              ))}
              <Card className="lg:col-span-6">
                <div className="flex h-full cursor-not-allowed flex-col">
                  <div className="flex items-start justify-between">
                    <p className="text-4xl leading-[0.9] font-semibold tracking-tighter text-fg sm:text-5xl">
                      Coming soon
                    </p>
                    <span aria-hidden className="text-xl text-fg-faint">
                      ↗
                    </span>
                  </div>
                  <p className="mt-auto max-w-lg pt-4 leading-relaxed text-fg-muted">
                    Projects are on their way. I'm picking out the work I'm
                    proudest of.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
