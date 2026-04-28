"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "../router";
import { useStore } from "../store/store";
import { Badge } from "../components/ui";
import { Check, ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function LessonViewer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const {
    courses,
    getProgress,
    toggleLessonComplete,
    recordLessonView,
    addLessonTime,
    setResumePoint,
  } = useStore();
  const { navigate } = useRouter();
  const course = courses.find((c) => c.id === courseId);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef<number>(Date.now());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const flat = useMemo(() => {
    if (!course) return [];
    return course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ moduleId: m.id, moduleTitle: m.title, lessonId: l.id, title: l.title })),
    );
  }, [course]);

  const lesson = course?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  const moduleOf = course?.modules.find((m) => m.lessons.some((l) => l.id === lessonId));
  const idx = flat.findIndex((f) => f.lessonId === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  const prog = getProgress(courseId);
  const isComplete = prog.completedLessons.includes(lessonId);
  const completedSet = new Set(prog.completedLessons);

  useEffect(() => {
    recordLessonView(courseId, lessonId);
    startTime.current = Date.now();
    return () => {
      const secs = Math.round((Date.now() - startTime.current) / 1000);
      addLessonTime(courseId, lessonId, Math.min(secs, 3600));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId]);

  useEffect(() => {
    const v = videoRef.current;
    if (v && lesson?.videoType === "mp4") {
      const r = prog.resumePoints[lessonId];
      if (r && r > 2) v.currentTime = r;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!course || !lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-ink-600">
        Lesson not found.{" "}
        <Link to="/" className="text-accent-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const handleComplete = () => {
    toggleLessonComplete(courseId, lessonId, !isComplete);
    if (!isComplete && next) {
      setTimeout(() => navigate(`/course/${courseId}/lesson/${next.lessonId}`), 250);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
        >
          <ChevronLeft size={16} strokeWidth={2} /> {course.title}
        </Link>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 lg:hidden"
        >
          {sidebarOpen ? <X size={14} strokeWidth={2} /> : <List size={14} strokeWidth={2} />}
          {sidebarOpen ? "Hide" : "Lessons"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {/* video */}
          <div className="diffusion-shadow overflow-hidden rounded-3xl bg-ink-950">
            <div className="relative aspect-video">
              {lesson.videoType === "youtube" ? (
                <iframe
                  key={lesson.id}
                  src={lesson.videoUrl}
                  title={lesson.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  key={lesson.id}
                  ref={videoRef}
                  src={lesson.videoUrl}
                  controls
                  className="absolute inset-0 h-full w-full"
                  onTimeUpdate={(e) => {
                    const t = Math.floor((e.target as HTMLVideoElement).currentTime);
                    if (t % 5 === 0) setResumePoint(courseId, lessonId, t);
                  }}
                />
              )}
            </div>
          </div>

          {/* lesson info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 text-xs">
              <Badge tone="neutral">{moduleOf?.title}</Badge>
              <span className="font-mono text-ink-400">{lesson.duration}</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{lesson.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">{lesson.content}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={handleComplete}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[0.98] ${
                  isComplete
                    ? "bg-accent-100 text-accent-700 hover:bg-accent-200"
                    : "bg-ink-900 text-white hover:bg-ink-800"
                }`}
              >
                {isComplete ? <Check size={16} strokeWidth={2.4} /> : null}
                {isComplete ? "Completed" : "Mark as completed"}
              </button>
              {moduleOf?.quiz && (
                <Link
                  to={`/course/${courseId}/quiz/${moduleOf.id}`}
                  className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 active:scale-[0.98]"
                >
                  Take module quiz
                </Link>
              )}
            </div>
          </motion.div>

          {/* prev/next */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-ink-100 pt-6">
            {prev ? (
              <button
                onClick={() => navigate(`/course/${courseId}/lesson/${prev.lessonId}`)}
                className="group flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 text-left transition hover:border-ink-300"
              >
                <ChevronLeft size={18} className="text-ink-400 group-hover:text-ink-900" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">Previous</div>
                  <p className="truncate text-sm font-medium text-ink-800">{prev.title}</p>
                </div>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => navigate(`/course/${courseId}/lesson/${next.lessonId}`)}
                className="group flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 text-right transition hover:border-ink-300"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">Next</div>
                  <p className="truncate text-sm font-medium text-ink-800">{next.title}</p>
                </div>
                <ChevronRight size={18} className="text-ink-400 group-hover:text-ink-900" strokeWidth={2} />
              </button>
            ) : <div />}
          </div>
        </div>

        {/* sidebar */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl border border-ink-200 bg-white p-3">
            <h3 className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-400">Course content</h3>
            {course.modules.map((m) => (
              <div key={m.id} className="mt-2">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-500">{m.title}</p>
                <ul className="mt-1">
                  {m.lessons.map((l) => {
                    const active = l.id === lessonId;
                    const done = completedSet.has(l.id);
                    return (
                      <li key={l.id}>
                        <Link
                          to={`/course/${courseId}/lesson/${l.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                            active ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-50"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] ${
                              done ? "bg-accent-500 text-white" : active ? "border border-white/40" : "border border-ink-200 text-ink-400"
                            }`}
                          >
                            {done ? "✓" : ""}
                          </span>
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// keep AnimatePresence referenced
void AnimatePresence;