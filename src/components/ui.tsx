import type { ReactNode } from "react";
import { Link } from "../router";

export function ProgressBar({ percent, className = "", trackClassName = "" }: { percent: number; className?: string; trackClassName?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-100 ${trackClassName} ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-400 transition-[width] duration-700 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "amber" | "rose" | "sky" | "violet" }) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-100 text-ink-700",
    accent: "bg-accent-50 text-accent-700 ring-1 ring-accent-200/60",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
    rose: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
    sky: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60",
    violet: "bg-violet-50 text-violet-700 ring-1 ring-violet-200/60",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  ctaTo,
  ctaLabel,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  ctaTo?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-50/40 via-transparent to-transparent" />
      <div className="relative">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white shadow-lg shadow-ink-900/20">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">{text}</p>
        {ctaTo && ctaLabel && (
          <Link
            to={ctaTo}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 active:scale-[0.98]"
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </Link>
        )}
      </div>
    </div>
  );
}

export function levelTone(level: string): "accent" | "amber" | "rose" {
  if (level === "Beginner") return "accent";
  if (level === "Intermediate") return "amber";
  return "rose";
}

// Course visual: a stylized SVG mark based on hue
export function CourseMark({ hue, className = "" }: { hue: number; className?: string }) {
  const c1 = `hsl(${hue}, 70%, 55%)`;
  const c2 = `hsl(${(hue + 40) % 360}, 70%, 50%)`;
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={`g-${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="68" height="68" rx="18" fill={`url(#g-${hue})`} />
      <circle cx="40" cy="36" r="10" fill="white" fillOpacity="0.95" />
      <path d="M30 56c2-6 6-9 10-9s8 3 10 9" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

export function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}