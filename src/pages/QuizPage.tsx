"use client";

import { useState } from "react";
import { Link } from "../router";
import { useStore } from "../store/store";
import { Badge } from "../components/ui";
import { Check, RotateCcw, Trophy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const { courses, recordQuizScore } = useStore();
  const course = courses.find((c) => c.id === courseId);
  const moduleObj = course?.modules.find((m) => m.id === moduleId);
  const quiz = moduleObj?.quiz;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!course || !quiz) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-ink-600">
        Quiz not found.{" "}
        <Link to="/" className="text-accent-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const total = quiz.questions.length;
  const correct = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passingScore;
  const allAnswered = quiz.questions.every((q) => answers[q.id] != null);

  const submit = () => {
    setSubmitted(true);
    recordQuizScore(courseId, quiz.id, score);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to={`/course/${courseId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        ← {course.title}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-4 rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Trophy size={20} strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900">{quiz.title}</h1>
          <p className="text-sm text-ink-500">
            {moduleObj?.title} · {total} questions · pass at {quiz.passingScore}%
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-6 rounded-3xl border p-8 text-center diffusion-shadow ${
              passed ? "border-accent-200 bg-accent-50/50" : "border-rose-200 bg-rose-50/50"
            }`}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                passed ? "bg-accent-500 text-white" : "bg-rose-500 text-white"
              }`}
            >
              {passed ? <Trophy size={28} strokeWidth={2.2} /> : <X size={28} strokeWidth={2.4} />}
            </motion.div>
            <h2 className={`mt-4 font-display text-4xl font-bold ${passed ? "text-accent-700" : "text-rose-700"}`}>
              {score}%
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              You got {correct} of {total} correct. {passed ? "Nice work — you passed." : "Almost there. Try again."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 active:scale-[0.98]"
              >
                <RotateCcw size={14} strokeWidth={2.2} /> Retry
              </button>
              <Link
                to={`/course/${courseId}`}
                className="rounded-2xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 active:scale-[0.98]"
              >
                Back to course
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {quiz.questions.map((q, qi) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.05 }}
            className="rounded-3xl border border-ink-200 bg-white p-6 diffusion-shadow"
          >
            <p className="mb-4 font-display text-base font-semibold text-ink-900">
              <span className="mr-2 font-mono text-xs text-ink-400">Q{qi + 1}</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                const isCorrect = oi === q.correctIndex;
                let cls = "border-ink-200 hover:border-ink-300";
                if (submitted) {
                  if (isCorrect) cls = "border-accent-400 bg-accent-50";
                  else if (selected) cls = "border-rose-400 bg-rose-50";
                  else cls = "border-ink-100 opacity-60";
                } else if (selected) {
                  cls = "border-ink-900 bg-ink-50";
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${cls}`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-mono ${
                        submitted && isCorrect
                          ? "border-accent-500 bg-accent-500 text-white"
                          : submitted && selected
                          ? "border-rose-500 bg-rose-500 text-white"
                          : selected
                          ? "border-ink-900 bg-ink-900 text-white"
                          : "border-ink-300 text-ink-400"
                      }`}
                    >
                      {submitted && isCorrect ? <Check size={10} strokeWidth={3} /> : String.fromCharCode(65 + oi)}
                    </span>
                    <span className="text-ink-700">{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-600">💡 {q.explanation}</p>
            )}
          </motion.div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="mt-6 w-full rounded-2xl bg-ink-900 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
        >
          {allAnswered ? "Submit answers" : `Answer all questions (${Object.keys(answers).length}/${total})`}
        </button>
      )}

      {/* keep Badge referenced */}
      <span className="hidden"><Badge tone="neutral">x</Badge></span>
    </div>
  );
}