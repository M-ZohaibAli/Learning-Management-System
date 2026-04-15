"use client";

import { motion } from "framer-motion";
import { Link } from "../router";
import { useStore, courseLessonCount, coursePercent } from "../store/store";
import { Badge, CourseMark, ProgressBar, formatNumber } from "../components/ui";
import { ArrowRight, Search, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Web Development", "Programming", "Design", "Data", "Mobile"];

export default function Home() {
  const { courses, getProgress, activeProfile, startDemo, profiles, demoInitialized } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Initialize demo on first visit
  useMemo(() => {
    if (!demoInitialized) {
      startDemo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoInitialized]);

  const filtered = courses.filter((c) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q);
    const matchCat = category === "All" || c.category === category;
    return matchQ && matchCat;
  });

  const featured = courses.slice(0, 4);

  return (
    <div className="grain">
      {/* HERO — asymmetric, left-aligned */}
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-ink-50">
        {/* Mesh gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blob absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent-300/40" />
          <div className="blob absolute right-0 top-32 h-96 w-96 rounded-full bg-sky-300/30" style={{ animationDelay: "-6s" }} />
          <div className="blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/40" style={{ animationDelay: "-12s" }} />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-24">
          {/* Left: copy */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs font-medium text-ink-600 backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
              </span>
              New · {courses.length} courses available
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink-900 sm:text-6xl lg:text-7xl"
            >
              Learn anything.{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Anywhere.</span>
                <svg className="absolute -bottom-2 left-0 z-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M2 8 Q 50 2, 100 6 T 198 5" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600"
            >
              Atlas is a modern learning platform built for the browser. Watch lessons, take quizzes, track your
              progress, and earn certificates — all stored privately on your device. No account required to start learning.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-ink-200 bg-white p-1.5 shadow-sm focus-within:border-accent-400 focus-within:ring-4 focus-within:ring-accent-100"
            >
              <Search size={18} className="ml-3 text-ink-400" strokeWidth={2} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 8 courses across web, design, data..."
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-ink-400"
              />
              <Link
                to="/dashboard"
                className="hidden rounded-xl bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800 active:scale-[0.98] sm:inline-flex"
              >
                My learning
              </Link>
            </motion.div>

            {/* Demo accounts */}
            {!activeProfile && profiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-5 text-sm text-ink-500"
              >
                Try a demo:{" "}
                {profiles.slice(0, 3).map((p, i) => (
                  <Link
                    key={p.id}
                    to="/profiles"
                    className="ml-1 underline decoration-ink-300 underline-offset-4 hover:text-ink-900"
                  >
                    {p.name}
                    {i < Math.min(profiles.length, 3) - 1 ? "," : ""}
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-ink-200/70 pt-6"
            >
              {[
                { v: "8", l: "Built-in courses" },
                { v: "60+", l: "Lessons & quizzes" },
                { v: "0", l: "Servers required" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-bold text-ink-900">{s.v}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-wider text-ink-400">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: floating preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="diffusion-shadow relative overflow-hidden rounded-3xl border border-ink-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Now learning</span>
                  <span className="flex items-center gap-1.5 text-xs text-accent-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500 soft-pulse" />
                    Live
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-ink-900">React Fundamentals</h3>
                <p className="mt-1 text-sm text-ink-500">Module 2 · State &amp; Hooks</p>

                <div className="mt-5 space-y-2.5">
                  {["useState", "useEffect", "useMemo", "Custom hooks"].map((t, i) => (
                    <div key={t} className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          i < 2 ? "bg-accent-500 text-white" : "border border-ink-200 text-ink-400"
                        }`}
                      >
                        {i < 2 ? "✓" : i + 1}
                      </span>
                      <span className={`text-sm ${i < 2 ? "text-ink-400 line-through" : "text-ink-700"}`}>{t}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-ink-500">Course progress</span>
                    <span className="font-mono font-semibold text-ink-900">42%</span>
                  </div>
                  <ProgressBar percent={42} />
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
                    <Zap size={16} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-ink-500">Daily streak</div>
                    <div className="font-display text-sm font-bold text-ink-900">12 days · +25 XP today</div>
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 -top-6 hidden rounded-2xl border border-ink-200 bg-white p-3 shadow-lg xl:block"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Sparkles size={14} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">Quiz passed</div>
                    <div className="text-xs font-semibold text-ink-900">+120 XP</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-ink-200 bg-white p-3 shadow-lg xl:block"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                    <TrendingUp size={14} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-400">This week</div>
                    <div className="text-xs font-semibold text-ink-900">4h 32m learned</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative border-t border-ink-200/60 bg-white/40 backdrop-blur">
          <div className="overflow-hidden py-4">
            <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
              {[...Array(2)].map((_, k) => (
                <div key={k} className="flex items-center gap-12">
              {[
                "Built for offline learning",
                "Privacy-first architecture",
                "Open standards",
                "Deploys to any static host",
                "localStorage powered",
                "Client-side only",
              ].map((t) => (
                    <span key={t + k} className="flex items-center gap-3 font-display text-sm font-medium text-ink-500">
                      <Sparkles size={14} className="text-accent-500" strokeWidth={2} />
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent-600">/ catalog</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Hand-picked courses
            </h2>
            <p className="mt-2 max-w-xl text-ink-500">
              Each course is structured into modules, lessons, and quizzes. Pick one and start in seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition active:scale-[0.97] ${
                  category === c
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="mt-10 grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-5 md:grid-cols-6">
          {/* Featured large tile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 md:row-span-2"
          >
            <Link
              to={`/course/${featured[0].id}`}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-ink-200 bg-white p-7 diffusion-shadow transition hover:border-ink-300"
            >
              <div className="flex items-start justify-between">
                <Badge tone="accent">Featured</Badge>
                <ArrowRight size={20} className="text-ink-400 transition group-hover:translate-x-1 group-hover:text-ink-900" strokeWidth={2} />
              </div>
              <div className="mt-12">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <Users size={12} strokeWidth={2} />
                  {formatNumber(featured[0].students)} learners
                  <span className="text-ink-300">·</span>
                  {featured[0].hours}h
                </div>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900">{featured[0].title}</h3>
                <p className="mt-2 max-w-md text-sm text-ink-500">{featured[0].longDescription}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${featured[0].id === "react-fundamentals" ? "from-sky-400 to-indigo-500" : "from-amber-400 to-orange-500"} text-xs font-bold text-white`}>
                    {featured[0].instructor.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">{featured[0].instructor}</div>
                    <div className="text-xs text-ink-500">{featured[0].instructorTitle}</div>
                  </div>
                </div>
              </div>
              {/* Decorative mark */}
              <CourseMark hue={featured[0].hue} className="absolute right-6 top-6 h-24 w-24 opacity-90" />
            </Link>
          </motion.div>

          {/* Side tiles */}
          {featured.slice(1, 3).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2"
            >
              <Link
                to={`/course/${c.id}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow transition hover:border-ink-300"
              >
                <CourseMark hue={c.hue} className="h-12 w-12" />
                <div>
                  <Badge tone="neutral">{c.category}</Badge>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-ink-900">{c.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-500">{c.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Remaining courses as uniform tiles */}
          {filtered.slice(3).map((c, i) => {
            const pct = activeProfile ? coursePercent(c, getProgress(c.id)) : 0;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-2"
              >
                <Link
                  to={`/course/${c.id}`}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow transition hover:border-ink-300"
                >
                  <div className="flex items-start justify-between">
                    <CourseMark hue={c.hue} className="h-11 w-11" />
                    <Badge tone={c.level === "Beginner" ? "accent" : c.level === "Intermediate" ? "amber" : "rose"}>
                      {c.level}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-tight text-ink-900">{c.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-500">{c.description}</p>
                    {pct > 0 && (
                      <div className="mt-3">
                        <ProgressBar percent={pct} />
                        <div className="mt-1 flex justify-between text-[10px] font-mono text-ink-400">
                          <span>{courseLessonCount(c)} lessons</span>
                          <span>{pct}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-ink-200 py-16 text-center text-ink-500">
            No courses match your filters.
          </div>
        )}
      </section>
    </div>
  );
}