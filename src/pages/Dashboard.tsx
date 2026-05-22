"use client";

import { Link } from "../router";
import { courseLessonCount, coursePercent, useStore } from "../store/store";
import { Badge, CourseMark, EmptyState, ProgressBar, formatNumber, formatTime } from "../components/ui";
import {
  Award,
  BookOpen,
  Download,
  Flame,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { activeProfile, courses } = useStore();

  if (!activeProfile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={<BookOpen size={22} strokeWidth={2} />}
          title="No active profile"
          text="Create a learner profile to start tracking your progress, XP, and certificates."
          ctaTo="/profiles"
          ctaLabel="Create profile"
        />
      </div>
    );
  }

  const enrolled = courses.filter((c) => activeProfile.progress[c.id]);

  let totalTime = 0;
  let totalCompleted = 0;
  const quizScores: number[] = [];
  const lessonViewEntries: { title: string; course: string; views: number }[] = [];

  for (const c of courses) {
    const prog = activeProfile.progress[c.id];
    if (!prog) continue;
    totalTime += Object.values(prog.lessonTime).reduce((a, b) => a + b, 0);
    totalCompleted += prog.completedLessons.length;
    quizScores.push(...Object.values(prog.quizScores));
    for (const m of c.modules) {
      for (const l of m.lessons) {
        const v = prog.lessonViews[l.id];
        if (v) lessonViewEntries.push({ title: l.title, course: c.title, views: v });
      }
    }
  }
  lessonViewEntries.sort((a, b) => b.views - a.views);
  const topLessons = lessonViewEntries.slice(0, 5);
  const avgQuiz = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
  const completedCourses = enrolled.filter((c) => coursePercent(c, activeProfile.progress[c.id]) === 100).length;

  const stats = [
    { label: "Courses enrolled", value: enrolled.length, icon: BookOpen, accent: "bg-sky-100 text-sky-700" },
    { label: "Lessons completed", value: totalCompleted, icon: Sparkles, accent: "bg-accent-100 text-accent-700" },
    { label: "Time learning", value: formatTime(totalTime), icon: TrendingUp, accent: "bg-violet-100 text-violet-700" },
    { label: "Avg. quiz score", value: `${avgQuiz}%`, icon: Award, accent: "bg-amber-100 text-amber-700" },
    { label: "Courses finished", value: completedCourses, icon: Trophy, accent: "bg-rose-100 text-rose-700" },
    { label: "Certificates", value: activeProfile.certificates.length, icon: Zap, accent: "bg-emerald-100 text-emerald-700" },
  ];

  const exportAnalytics = () => {
    const data = {
      profile: activeProfile.name,
      generatedAt: new Date().toISOString(),
      totalTimeSeconds: totalTime,
      lessonsCompleted: totalCompleted,
      avgQuizScore: avgQuiz,
      courses: enrolled.map((c) => ({
        course: c.title,
        percent: coursePercent(c, activeProfile.progress[c.id]),
        quizScores: activeProfile.progress[c.id].quizScores,
      })),
      topLessons,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atlas-analytics.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-ink-200/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent-600">/ dashboard</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Welcome back, {activeProfile.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-ink-500">Here's your learning at a glance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-2.5">
            <Flame size={16} className="text-orange-500" strokeWidth={2.2} />
            <div>
              <div className="font-display text-sm font-bold text-ink-900">{activeProfile.streak}-day streak</div>
              <div className="text-[10px] uppercase tracking-wider text-ink-400">Keep it going</div>
            </div>
          </div>
          <button
            onClick={exportAnalytics}
            className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition hover:border-ink-300 active:scale-[0.98]"
          >
            <Download size={14} strokeWidth={2.2} /> Export analytics
          </button>
        </div>
      </div>

      {/* Stats bento */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="rounded-3xl border border-ink-200 bg-white p-5 diffusion-shadow"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.accent}`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div className="mt-3 font-display text-2xl font-bold text-ink-900">{s.value}</div>
              <div className="mt-0.5 text-xs text-ink-500">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* XP Bar */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-ink-200 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Experience</div>
            <div className="mt-1 font-display text-3xl font-bold">{activeProfile.xp.toLocaleString()} <span className="text-base font-normal text-ink-400">XP</span></div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="mb-1.5 flex justify-between text-xs text-ink-300">
              <span>Level {Math.floor(activeProfile.xp / 1000) + 1}</span>
              <span className="font-mono">{activeProfile.xp % 1000}/1000 to next</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(activeProfile.xp % 1000) / 10}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-300"
              />
            </div>
          </div>
        </div>
      </div>

      {enrolled.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Sparkles size={22} strokeWidth={2} />}
            title="No courses yet"
            text="Browse the catalog and start your first lesson to see progress here."
            ctaTo="/"
            ctaLabel="Browse courses"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* In progress */}
          <div>
            <h2 className="mb-4 font-display text-xl font-bold text-ink-900">Continue learning</h2>
            <div className="space-y-3">
              {enrolled.map((c, i) => {
                const prog = activeProfile.progress[c.id];
                const pct = coursePercent(c, prog);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/course/${c.id}`}
                      className="group flex items-center gap-4 rounded-3xl border border-ink-200 bg-white p-4 transition hover:border-ink-300 active:scale-[0.99]"
                    >
                      <CourseMark hue={c.hue} className="h-14 w-14 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-display text-base font-bold text-ink-900">{c.title}</h3>
                          {pct === 100 && <Badge tone="accent">Complete</Badge>}
                        </div>
                        <p className="text-xs text-ink-500">
                          {prog.completedLessons.length}/{courseLessonCount(c)} lessons · {c.instructor}
                        </p>
                        <div className="mt-2.5">
                          <ProgressBar percent={pct} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold text-ink-900">{pct}%</div>
                        <div className="text-[10px] uppercase tracking-wider text-ink-400">Progress</div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Side analytics */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-ink-400">Most viewed</h3>
                <TrendingUp size={14} className="text-accent-500" strokeWidth={2.2} />
              </div>
              {topLessons.length === 0 ? (
                <p className="mt-4 text-sm text-ink-400">No views yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {topLessons.map((l, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-50 font-mono text-[10px] font-bold text-ink-600">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-800">{l.title}</p>
                        <p className="truncate text-xs text-ink-400">{l.course}</p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-ink-500">{l.views}×</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {activeProfile.certificates.length > 0 && (
              <div className="rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow">
                <h3 className="font-display text-sm font-bold uppercase tracking-widest text-ink-400">Certificates</h3>
                <ul className="mt-4 space-y-2">
                  {activeProfile.certificates.map((cert) => (
                    <li key={cert.id}>
                      <Link
                        to={`/certificate/${cert.courseId}`}
                        className="flex items-center justify-between rounded-2xl bg-amber-50 px-3 py-2.5 text-sm text-amber-900 transition hover:bg-amber-100"
                      >
                        <span className="truncate font-medium">{cert.courseTitle}</span>
                        <span className="ml-2 font-mono text-[10px] text-amber-700">{cert.id.slice(0, 12)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-ink-400">Categories</h3>
              <div className="mt-4 space-y-2">
                {Object.entries(
                  enrolled.reduce<Record<string, number>>((acc, c) => {
                    acc[c.category] = (acc[c.category] ?? 0) + 1;
                    return acc;
                  }, {}),
                ).map(([cat, n]) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-ink-700">{cat}</span>
                    <span className="font-mono text-xs text-ink-400">{n} {n === 1 ? "course" : "courses"}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-400">
                Total learners: <span className="font-mono">{formatNumber(24830)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}