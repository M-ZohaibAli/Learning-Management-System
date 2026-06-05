"use client";

import { useRef, useState } from "react";
import { Link, useRouter } from "../router";
import { useStore } from "../store/store";
import type { Course, Lesson, Module, QuizQuestion } from "../types";
import { ArrowLeft, Download, Eye, Plus, Trash2, Upload } from "lucide-react";
import { Badge } from "../components/ui";

const HUES = [158, 38, 280, 200, 320, 18, 250, 220, 12, 95];
const CATS = ["Web Development", "Programming", "Design", "Data", "Mobile", "Marketing", "Business"];

function uid() {
  return "x" + Math.random().toString(36).slice(2, 8);
}

function blankCourse(): Course {
  return {
    id: "course-" + uid(),
    title: "",
    description: "",
    longDescription: "",
    instructor: "",
    instructorTitle: "",
    category: "Web Development",
    level: "Beginner",
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    rating: 4.7,
    students: 0,
    hours: 4,
    modules: [],
  };
}

export default function Instructor() {
  const { courses, customCourses, addCourse, removeCourse } = useStore();
  const { navigate } = useRouter();
  const [draft, setDraft] = useState<Course | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const defaultCourses = courses.filter((c) => !customCourses.some((d) => d.id === c.id));

  const update = (patch: Partial<Course>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const addModule = () =>
    update({ modules: [...(draft!.modules), { id: "m" + uid(), title: "New Module", lessons: [] }] });

  const updateModule = (mid: string, patch: Partial<Module>) =>
    update({ modules: draft!.modules.map((m) => (m.id === mid ? { ...m, ...patch } : m)) });

  const removeModule = (mid: string) => update({ modules: draft!.modules.filter((m) => m.id !== mid) });

  const addLesson = (mid: string) => {
    const lesson: Lesson = {
      id: "l" + uid(),
      title: "New Lesson",
      duration: "5 min",
      videoType: "youtube",
      videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM",
      content: "",
    };
    updateModule(mid, { lessons: [...draft!.modules.find((m) => m.id === mid)!.lessons, lesson] });
  };

  const updateLesson = (mid: string, lid: string, patch: Partial<Lesson>) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    updateModule(mid, { lessons: m.lessons.map((l) => (l.id === lid ? { ...l, ...patch } : l)) });
  };

  const removeLesson = (mid: string, lid: string) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    updateModule(mid, { lessons: m.lessons.filter((l) => l.id !== lid) });
  };

  const toggleQuiz = (mid: string) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    if (m.quiz) updateModule(mid, { quiz: undefined });
    else
      updateModule(mid, {
        quiz: { id: "q" + uid(), title: "Module Quiz", passingScore: 60, questions: [] },
      });
  };

  const addQuestion = (mid: string) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    if (!m.quiz) return;
    const q: QuizQuestion = {
      id: "qq" + uid(),
      question: "New question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
    };
    updateModule(mid, { quiz: { ...m.quiz, questions: [...m.quiz.questions, q] } });
  };

  const updateQuestion = (mid: string, qid: string, patch: Partial<QuizQuestion>) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    if (!m.quiz) return;
    updateModule(mid, {
      quiz: { ...m.quiz, questions: m.quiz.questions.map((q) => (q.id === qid ? { ...q, ...patch } : q)) },
    });
  };

  const removeQuestion = (mid: string, qid: string) => {
    const m = draft!.modules.find((x) => x.id === mid)!;
    if (!m.quiz) return;
    updateModule(mid, { quiz: { ...m.quiz, questions: m.quiz.questions.filter((q) => q.id !== qid) } });
  };

  const exportDraft = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(draft.title || "course").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCourse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Course;
        if (data && data.title && Array.isArray(data.modules)) setDraft(data);
        else alert("Invalid course JSON.");
      } catch {
        alert("Could not parse file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const publish = () => {
    if (!draft) return;
    if (!draft.title.trim()) return alert("Course needs a title.");
    addCourse(draft);
    alert("Course published! It now appears in the catalog.");
    setDraft(null);
  };

  const input =
    "w-full rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 text-sm outline-none transition focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100";

  // Builder view
  if (draft) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setDraft(null)} className="rounded-xl p-2 text-ink-500 hover:bg-ink-100">
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent-600">/ course builder</span>
              <h1 className="font-display text-2xl font-bold text-ink-900">{draft.title || "Untitled course"}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportDraft} className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:border-ink-300">
              <Download size={14} strokeWidth={2.2} /> Export
            </button>
            <button
              onClick={() => {
                addCourse(draft);
                navigate(`/course/${draft.id}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:border-ink-300"
            >
              <Eye size={14} strokeWidth={2.2} /> Preview
            </button>
            <button onClick={publish} className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 active:scale-[0.98]">
              Publish
            </button>
          </div>
        </div>

        {/* meta */}
        <div className="space-y-4 rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Title</label>
              <input className={input} value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="Course title" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Instructor</label>
              <input className={input} value={draft.instructor} onChange={(e) => update({ instructor: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Title / role</label>
              <input className={input} value={draft.instructorTitle} onChange={(e) => update({ instructorTitle: e.target.value })} placeholder="e.g. Staff Engineer, ex-Stripe" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Category</label>
              <select className={input} value={draft.category} onChange={(e) => update({ category: e.target.value })}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Level</label>
              <select className={input} value={draft.level} onChange={(e) => update({ level: e.target.value as Course["level"] })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Approx. hours</label>
              <input type="number" className={input} value={draft.hours} onChange={(e) => update({ hours: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Short description</label>
            <input className={input} value={draft.description} onChange={(e) => update({ description: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Full description</label>
            <textarea rows={3} className={input} value={draft.longDescription} onChange={(e) => update({ longDescription: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">Theme color</label>
            <div className="flex flex-wrap gap-2">
              {HUES.map((h) => (
                <button
                  key={h}
                  onClick={() => update({ hue: h })}
                  className={`h-9 w-9 rounded-xl transition ${draft.hue === h ? "ring-2 ring-ink-900 ring-offset-2" : "hover:scale-105"}`}
                  style={{ background: `hsl(${h}, 65%, 55%)` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* modules */}
        <div className="mt-6 space-y-4">
          {draft.modules.map((m, mi) => (
            <div key={m.id} className="rounded-3xl border border-ink-200 bg-white p-5 diffusion-shadow">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">M{mi + 1}</span>
                <input className={`${input} flex-1`} value={m.title} onChange={(e) => updateModule(m.id, { title: e.target.value })} />
                <button onClick={() => removeModule(m.id)} className="rounded-xl p-2 text-ink-400 hover:bg-rose-50 hover:text-rose-600">
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>

              <div className="mt-3 space-y-3 pl-0 sm:pl-4">
                {m.lessons.map((l) => (
                  <div key={l.id} className="rounded-2xl border border-ink-100 bg-ink-50/50 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        className="min-w-[180px] flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400"
                        value={l.title}
                        onChange={(e) => updateLesson(m.id, l.id, { title: e.target.value })}
                      />
                      <input
                        className="w-20 rounded-xl border border-ink-200 bg-white px-2 py-2 text-sm"
                        value={l.duration}
                        onChange={(e) => updateLesson(m.id, l.id, { duration: e.target.value })}
                      />
                      <button onClick={() => removeLesson(m.id, l.id)} className="rounded-xl p-2 text-ink-400 hover:bg-rose-100 hover:text-rose-600">
                        <Trash2 size={12} strokeWidth={2} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <select
                        className="w-24 rounded-xl border border-ink-200 bg-white px-2 py-2 text-sm"
                        value={l.videoType}
                        onChange={(e) => updateLesson(m.id, l.id, { videoType: e.target.value as Lesson["videoType"] })}
                      >
                        <option value="youtube">YouTube</option>
                        <option value="mp4">MP4</option>
                      </select>
                      <input
                        className="min-w-[200px] flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
                        value={l.videoUrl}
                        placeholder="Video URL (embed)"
                        onChange={(e) => updateLesson(m.id, l.id, { videoUrl: e.target.value })}
                      />
                    </div>
                    <textarea
                      rows={2}
                      className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
                      placeholder="Lesson description"
                      value={l.content}
                      onChange={(e) => updateLesson(m.id, l.id, { content: e.target.value })}
                    />
                  </div>
                ))}
                <button
                  onClick={() => addLesson(m.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-500 hover:border-accent-400 hover:text-accent-600"
                >
                  <Plus size={12} strokeWidth={2.4} /> Add lesson
                </button>
              </div>

              {/* quiz */}
              <div className="mt-4 border-t border-ink-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-amber-700">Quiz</span>
                  <button onClick={() => toggleQuiz(m.id)} className="text-xs font-medium text-ink-700 hover:text-ink-900">
                    {m.quiz ? "Remove quiz" : "+ Add quiz"}
                  </button>
                </div>
                {m.quiz && (
                  <div className="mt-3 space-y-3 rounded-2xl bg-amber-50/40 p-3">
                    <div className="flex flex-wrap gap-2">
                      <input
                        className="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
                        value={m.quiz.title}
                        onChange={(e) => updateModule(m.id, { quiz: { ...m.quiz!, title: e.target.value } })}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          className="w-16 rounded-xl border border-ink-200 bg-white px-2 py-2 text-sm"
                          value={m.quiz.passingScore}
                          onChange={(e) => updateModule(m.id, { quiz: { ...m.quiz!, passingScore: Number(e.target.value) } })}
                        />
                        <span className="text-xs text-ink-500">% pass</span>
                      </div>
                    </div>
                    {m.quiz.questions.map((q, qi) => (
                      <div key={q.id} className="rounded-xl border border-amber-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-amber-700">Q{qi + 1}</span>
                          <input
                            className="flex-1 rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm"
                            value={q.question}
                            onChange={(e) => updateQuestion(m.id, q.id, { question: e.target.value })}
                          />
                          <button onClick={() => removeQuestion(m.id, q.id)} className="rounded-lg p-1.5 text-ink-400 hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 size={12} strokeWidth={2} />
                          </button>
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                checked={q.correctIndex === oi}
                                onChange={() => updateQuestion(m.id, q.id, { correctIndex: oi })}
                                className="accent-emerald-500"
                              />
                              <input
                                className="flex-1 rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm"
                                value={opt}
                                onChange={(e) => {
                                  const options = [...q.options];
                                  options[oi] = e.target.value;
                                  updateQuestion(m.id, q.id, { options });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addQuestion(m.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                    >
                      <Plus size={12} strokeWidth={2.4} /> Add question
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addModule}
            className="w-full rounded-3xl border-2 border-dashed border-ink-200 py-5 text-sm font-semibold text-ink-500 transition hover:border-accent-400 hover:text-accent-600 active:scale-[0.99]"
          >
            <Plus size={14} strokeWidth={2.4} className="mr-1 inline" /> Add module
          </button>
        </div>
      </div>
    );
  }

  // Landing
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 p-8 text-white sm:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="blob absolute -right-10 -top-10 h-72 w-72 rounded-full bg-accent-500/30" />
          <div className="blob absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-sky-500/20" style={{ animationDelay: "-8s" }} />
        </div>
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent-400">/ instructor studio</span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Build courses in your browser.
            </h1>
             <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300">
               Author modules, lessons, and quizzes with a visual builder. Export your course as portable JSON to share
               or back up. Fully client-side — no backend required.
             </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setDraft(blankCourse())}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-100 active:scale-[0.98]"
              >
                <Plus size={16} strokeWidth={2.4} /> New course
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Upload size={16} strokeWidth={2.2} /> Import JSON
              </button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importCourse} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { v: "Modules", l: "Group lessons" },
              { v: "Quizzes", l: "Auto-graded" },
              { v: "YouTube", l: "Or MP4" },
              { v: "JSON", l: "Export anywhere" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="font-display text-xl font-bold">{s.v}</div>
                <div className="mt-0.5 text-xs text-ink-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mt-12 mb-4 font-display text-xl font-bold text-ink-900">Your published courses</h2>
      {customCourses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink-200 py-12 text-center text-sm text-ink-400">
          No custom courses yet. Click "New course" above to start authoring.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {customCourses.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-3xl border border-ink-200 bg-white p-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-2xl" style={{ background: `hsl(${c.hue}, 65%, 55%)` }} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-base font-bold text-ink-900">{c.title || "Untitled"}</h3>
                <p className="text-xs text-ink-500">
                  {c.modules.length} modules · {c.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                </p>
              </div>
              <Link to={`/course/${c.id}`} className="rounded-xl bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-200">
                View
              </Link>
              <button
                onClick={() => setDraft(structuredClone(c))}
                className="rounded-xl bg-accent-100 px-3 py-1.5 text-xs font-semibold text-accent-700 hover:bg-accent-200"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${c.title}"?`)) removeCourse(c.id);
                }}
                className="rounded-xl p-1.5 text-ink-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Default courses showcase */}
      <h2 className="mt-12 mb-4 font-display text-xl font-bold text-ink-900">Built-in catalog</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {defaultCourses.map((c) => (
          <Link key={c.id} to={`/course/${c.id}`} className="group flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4 transition hover:border-ink-300">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: `hsl(${c.hue}, 65%, 55%)` }} />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-ink-900">{c.title}</h3>
              <p className="truncate text-xs text-ink-500">{c.instructor}</p>
            </div>
            <Badge tone={c.level === "Beginner" ? "accent" : c.level === "Intermediate" ? "amber" : "rose"}>{c.level}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}