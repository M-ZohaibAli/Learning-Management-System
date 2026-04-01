"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Link, useRouter } from "../router";
import { useStore } from "../store/store";
import { GraduationCap, LayoutDashboard, Sparkles, User2 } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { activeProfile } = useStore();
  const { path } = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const links = [
    { to: "/", label: "Catalog", icon: Sparkles },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/instructor", label: "Teach", icon: GraduationCap },
  ];

  const isActive = (to: string) =>
    to === "/" ? path === "/" || path.startsWith("/course") : path.startsWith(to);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-ink-200/60 bg-ink-50/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white shadow-md shadow-ink-900/20">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7l10-5 10 5-10 5L2 7z" />
              <path d="M6 10v5c0 1 3 3 6 3s6-2 6-3v-5" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent-400 ring-2 ring-ink-50" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-lg font-bold tracking-tight text-ink-900">Atlas</span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-400">LMS</span>
          </div>
        </Link>

        <nav
          onMouseLeave={() => setHovered(null)}
          className="hidden items-center gap-1 rounded-full border border-ink-200/60 bg-white/70 p-1 shadow-sm backdrop-blur md:flex"
        >
          {links.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.to);
            return (
              <Link key={l.to} to={l.to}>
                <motion.div
                  onMouseEnter={() => setHovered(l.to)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active ? "text-ink-900" : "text-ink-500 hover:text-ink-800"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <AnimatePresence>
                    {hovered === l.to && (
                      <motion.span
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-full ${active ? "bg-accent-500" : "bg-ink-900"}`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className={`relative z-10 flex items-center gap-1.5 ${active && hovered !== l.to ? "font-semibold" : ""}`}>
                    <Icon size={14} strokeWidth={2} />
                    {l.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/profiles"
            className="group flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-ink-700 shadow-sm transition hover:border-ink-300 active:scale-[0.98]"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white ${activeProfile?.color ?? "from-ink-700 to-ink-900"}`}>
              {activeProfile ? activeProfile.avatar : <User2 size={14} strokeWidth={2.2} />}
            </span>
            <span className="hidden max-w-[100px] truncate sm:inline">{activeProfile?.name ?? "Sign in"}</span>
          </Link>
        </div>
      </div>

      <nav className="grid grid-cols-3 border-t border-ink-200/60 bg-white/80 backdrop-blur md:hidden">
        {links.map((l) => {
          const Icon = l.icon;
          const active = isActive(l.to);
          return (
            <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${active ? "text-ink-900" : "text-ink-400"}`}>
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}