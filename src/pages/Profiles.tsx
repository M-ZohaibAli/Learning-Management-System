"use client";

import { useRef, useState } from "react";
import { useRouter } from "../router";
import { useStore } from "../store/store";
import type { Profile } from "../types";
import { ArrowRight, Download, Plus, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-blue-500",
];

export default function Profiles() {
  const { profiles, activeProfile, createProfile, switchProfile, deleteProfile, exportProfile, importProfile } =
    useStore();
  const { navigate } = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (!name.trim()) return;
    createProfile({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@atlaslms.io`,
      role: "learner",
      avatar: name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: gradient,
    });
    setName("");
    setEmail("");
    navigate("/dashboard");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Profile;
        if (data && data.name) {
          importProfile(data);
          navigate("/dashboard");
        } else alert("Invalid profile file.");
      } catch {
        alert("Could not read that file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent-600">/ profiles</span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Learner profiles
        </h1>
         <p className="mt-2 max-w-xl text-ink-500">
           Profiles live privately in your browser. Switch between them, export your progress, or import a backup.
         </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Create form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ink-200 bg-white p-7 diffusion-shadow"
        >
          <h2 className="font-display text-lg font-bold text-ink-900">Create a new profile</h2>
          <p className="mt-1 text-sm text-ink-500">It only takes a second.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none transition focus:border-accent-400 focus:bg-white focus:ring-4 focus:ring-accent-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-500">Email (optional)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full rounded-2xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none transition focus:border-accent-400 focus:bg-white focus:ring-4 focus:ring-accent-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500">Avatar color</label>
              <div className="flex flex-wrap gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGradient(g)}
                    className={`h-9 w-9 rounded-xl bg-gradient-to-br ${g} transition ${
                      gradient === g ? "ring-2 ring-ink-900 ring-offset-2" : "hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 py-3 text-sm font-semibold text-white transition enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
            >
              <Plus size={16} strokeWidth={2.4} /> Create profile
            </button>

            <div className="border-t border-ink-100 pt-4">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900"
              >
                <Upload size={14} strokeWidth={2.2} /> Import profile from JSON
              </button>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
            </div>
          </div>
        </motion.div>

        {/* Profile list */}
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-ink-900">
            Existing profiles
            <span className="ml-2 font-mono text-sm font-normal text-ink-400">{profiles.length}</span>
          </h2>

          {profiles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink-200 py-12 text-center text-sm text-ink-400">
              No profiles yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {profiles.map((p, i) => {
                  const isActive = activeProfile?.id === p.id;
                  const courseCount = Object.keys(p.progress).length;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-4 rounded-3xl border bg-white p-4 transition ${
                        isActive ? "border-accent-300 ring-2 ring-accent-100" : "border-ink-200"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-sm font-bold text-white shadow-md`}>
                        {p.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-display text-base font-bold text-ink-900">{p.name}</h3>
                          {isActive && (
                            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-700">
                              Active
                            </span>
                          )}
                          {p.role === "instructor" && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                              Instructor
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-ink-500">
                          {courseCount} {courseCount === 1 ? "course" : "courses"} · {p.certificates.length} certificates · {p.xp} XP
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isActive && (
                          <button
                            onClick={() => switchProfile(p.id)}
                            className="rounded-xl bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-200 active:scale-[0.97]"
                          >
                            Switch
                          </button>
                        )}
                        {isActive && (
                          <button
                            onClick={exportProfile}
                            className="inline-flex items-center gap-1 rounded-xl bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-200 active:scale-[0.97]"
                          >
                            <Download size={12} strokeWidth={2.2} /> Export
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Delete profile "${p.name}"? This cannot be undone.`)) deleteProfile(p.id);
                          }}
                          className="rounded-xl p-2 text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

           {/* Demo hint */}
           <div className="mt-6 rounded-2xl border border-dashed border-accent-200 bg-accent-50/40 p-4 text-xs text-accent-800">
             <strong className="font-semibold">Demo profiles:</strong> Three sample profiles are created on first visit
             so you can explore immediately. They are stored locally in your browser.
           </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900"
        >
          Browse the catalog <ArrowRight size={14} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}