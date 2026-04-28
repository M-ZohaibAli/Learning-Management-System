"use client";

import { Link } from "../router";
import { useStore, courseIsComplete, courseLessonCount, coursePercent } from "../store/store";
import { Badge, CourseMark, ProgressBar, levelTone } from "../components/ui";
import { ArrowLeft, Award, BookOpen, Clock, PlayCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function CourseDetail({ courseId }: { courseId: string }) {
  const { courses, getProgress, activeProfile } = useStore();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg text-ink-600">Course not found.</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-accent-600 hover:underline">
          <ArrowLeft size={14} strokeWidth={2} /> Back to catalog
        </Link>
      </div>
    );
  }

  const prog = getProgress(course.id);
  const pct = coursePercent(course, prog);
  const completedSet = new Set(prog.completedLessons);

  const allLessons = course.modules.flatMap((m) => m.lessons);
  let resumeLesson = allLessons.find((l) => !completedSet.has(l.id)) ?? allLessons[0];

  const cert = activeProfile?.certificates.find((c) => c.courseId === course.id);
  const isComplete = courseIsComplete(course, prog);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-ink-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="blob absolute -right-20 top-0 h-80 w-80 rounded-full opacity-30" style={{ background: `hsl(${course.hue}, 70%, 60%)` }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
            <ArrowLeft size={14} strokeWidth={2} /> Catalog
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{course.category}</Badge>
                <Badge tone={levelTone(course.level)}>{course.level}</Badge>
                <span className="flex items-center gap-1 text-xs text-ink-500">
                  <Clock size={12} strokeWidth={2} /> {course.hours}h · {courseLessonCount(course)} lessons
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">{course.description}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${course.id === "react-fundamentals" ? "from-sky-400 to-indigo-500" : course.id === "js-essentials" ? "from-amber-400 to-orange-500" : "from-ink-700 to-ink-900"} text-sm font-bold text-white`}>
                  {course.instructor.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{course.instructor}</div>
                  <div className="text-xs text-ink-500">{course.instructorTitle}</div>
                </div>
              </div>
            </div>

            {/* Right: progress / CTA card */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="diffusion-shadow rounded-3xl border border-ink-200 bg-white p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Your progress</span>
                  <span className="font-display text-3xl font-bold text-ink-900">{pct}<span className="text-base text-ink-400">%</span></span>
                </div>
                <div className="mt-3">
                  <ProgressBar percent={pct} />
                  <div className="mt-2 flex justify-between text-xs text-ink-500">
                    <span>{prog.completedLessons.length} of {courseLessonCount(course)} lessons</span>
                    <span>{course.modules.filter((m) => m.quiz && (prog.quizScores[m.quiz.id] ?? -1) >= m.quiz.passingScore).length}/{course.modules.filter((m) => m.quiz).length} quizzes passed</span>
                  </div>
                </div>

                {resumeLesson && (
                  <Link
                    to={`/course/${course.id}/lesson/${resumeLesson.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-800 active:scale-[0.99]"
                  >
                    <PlayCircle size={18} strokeWidth={2} />
                    {pct === 0 ? "Start course" : pct === 100 ? "Review lessons" : "Continue learning"}
                  </Link>
                )}

                {isComplete && (
                  <Link
                    to={`/certificate/${course.id}`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition hover:opacity-95 active:scale-[0.99]"
                  >
                    <Trophy size={16} strokeWidth={2.2} />
                    {cert ? "View certificate" : "Claim certificate"}
                  </Link>
                )}

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-100 pt-5 text-center">
                  {[
                    { v: course.modules.length, l: "Modules" },
                    { v: courseLessonCount(course), l: "Lessons" },
                    { v: course.modules.filter((m) => m.quiz).length, l: "Quizzes" },
                  ].map((s) => (
                    <div key={s.l}>
                      <div className="font-display text-xl font-bold text-ink-900">{s.v}</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-400">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent-600">/ curriculum</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink-900">What you'll learn</h2>
            <p className="mt-3 max-w-2xl text-ink-600">{course.longDescription}</p>

            <div className="mt-8 space-y-4">
              {course.modules.map((m, mi) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: mi * 0.05 }}
                  className="overflow-hidden rounded-3xl border border-ink-200 bg-white"
                >
                  <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/50 px-6 py-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Module {mi + 1}</span>
                      <h3 className="font-display text-lg font-bold text-ink-900">{m.title}</h3>
                    </div>
                    <span className="text-xs text-ink-500">{m.lessons.length} lessons</span>
                  </div>
                  <ul className="divide-y divide-ink-100">
                    {m.lessons.map((l) => {
                      const done = completedSet.has(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to={`/course/${course.id}/lesson/${l.id}`}
                            className="group flex items-center gap-4 px-6 py-3.5 transition hover:bg-accent-50/40"
                          >
                            <span
                              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs ${
                                done ? "bg-accent-500 text-white" : "border border-ink-200 text-ink-400 group-hover:border-accent-400 group-hover:text-accent-600"
                              }`}
                            >
                              {done ? "✓" : <PlayCircle size={12} strokeWidth={2.4} />}
                            </span>
                            <span className={`flex-1 text-sm ${done ? "text-ink-400 line-through" : "text-ink-800"}`}>{l.title}</span>
                            <span className="font-mono text-xs text-ink-400">{l.duration}</span>
                          </Link>
                        </li>
                      );
                    })}
                    {m.quiz && (
                      <li>
                        <Link
                          to={`/course/${course.id}/quiz/${m.id}`}
                          className="group flex items-center gap-4 px-6 py-3.5 transition hover:bg-amber-50/40"
                        >
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <BookOpen size={12} strokeWidth={2.4} />
                          </span>
                          <span className="flex-1 text-sm font-medium text-ink-800">{m.quiz.title}</span>
                          {prog.quizScores[m.quiz.id] != null ? (
                            <Badge tone={prog.quizScores[m.quiz.id] >= m.quiz.passingScore ? "accent" : "rose"}>
                              {prog.quizScores[m.quiz.id]}%
                            </Badge>
                          ) : (
                            <span className="font-mono text-xs text-ink-400">not taken</span>
                          )}
                        </Link>
                      </li>
                    )}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side info */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-ink-200 bg-white p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-ink-400">Includes</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  { i: <PlayCircle size={16} strokeWidth={2} />, t: `${courseLessonCount(course)} on-demand video lessons` },
                  { i: <BookOpen size={16} strokeWidth={2} />, t: `${course.modules.filter((m) => m.quiz).length} knowledge-check quizzes` },
                  { i: <Award size={16} strokeWidth={2} />, t: "Verifiable completion certificate" },
                  { i: <Clock size={16} strokeWidth={2} />, t: `${course.hours} hours of content` },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-ink-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-50 text-ink-700">{f.i}</span>
                    {f.t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-ink-200 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
              <CourseMark hue={course.hue} className="h-12 w-12 opacity-90" />
              <h3 className="mt-4 font-display text-lg font-bold">Built for focus</h3>
              <p className="mt-2 text-sm text-ink-300">
                Atlas works offline. Your progress, certificates, and notes stay in your browser — private by default.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}