import { useEffect, useState } from "react";

// Where I am. Change these if I move.
const MY_CITY = "Budapest";
const MY_TIME_ZONE = "Europe/Budapest";

const visitorTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const visitorCity = visitorTimeZone.split("/").pop()!.replace(/_/g, " ");

function timeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("hour")}:${get("minute")}`;
}

// Minutes the zone is ahead of UTC at the given moment.
function utcOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)!.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
  );
  return Math.round((asUtc - date.getTime()) / 60000);
}

function describeDifference(minutes: number) {
  if (minutes === 0) return "Same time as you";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
  return `I'm ${amount} ${minutes < 0 ? "behind" : "ahead of"} you`;
}

export default function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const mine = timeParts(now, MY_TIME_ZONE);
  const yours = timeParts(now, visitorTimeZone);
  const difference =
    utcOffset(now, MY_TIME_ZONE) - utcOffset(now, visitorTimeZone);

  return (
    <div className="flex h-full flex-col font-mono">
      <div className="flex justify-between text-xs tracking-wider text-fg-faint uppercase">
        <p>Local time</p>
        <p>{describeDifference(difference)}</p>
      </div>

      <div className="mt-5 text-sm text-fg-soft">Me · {MY_CITY}</div>
      <div className="flex items-end justify-between">
        <p className="font-sans text-3xl font-medium tracking-tight text-fg tabular-nums">
          {mine}
        </p>
        <p className="pb-1 text-sm text-fg-muted">my clock</p>
      </div>

      <hr className="my-5 border-line" />

      <div className="text-sm text-fg-soft">You · {visitorCity}</div>
      <div className="flex items-end justify-between">
        <p className="font-sans text-3xl font-medium tracking-tight text-fg tabular-nums">
          {yours}
        </p>
        <p className="pb-1 text-sm text-fg-muted">your clock</p>
      </div>
    </div>
  );
}
