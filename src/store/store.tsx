import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Certificate, Course, CourseProgress, Profile } from "../types";
import { courses as defaultCourses, demoProfiles } from "../data/courses";

const PROFILES_KEY = "atlaslms_profiles_v1";
const ACTIVE_KEY = "atlaslms_active_v1";
const CUSTOM_COURSES_KEY = "atlaslms_custom_courses_v1";
const DEMO_INIT_KEY = "atlaslms_demo_init_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function emptyProgress(courseId: string): CourseProgress {
  return {
    courseId,
    completedLessons: [],
    quizScores: {},
    lessonTime: {},
    lessonViews: {},
    resumePoints: {},
    lastVisited: Date.now(),
  };
}

interface StoreContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  courses: Course[];
  customCourses: Course[];
  demoInitialized: boolean;
  createProfile: (p: Omit<Profile, "id" | "createdAt" | "progress" | "certificates" | "streak" | "xp">) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  getProgress: (courseId: string) => CourseProgress;
  toggleLessonComplete: (courseId: string, lessonId: string, complete: boolean) => void;
  recordLessonView: (courseId: string, lessonId: string) => void;
  addLessonTime: (courseId: string, lessonId: string, seconds: number) => void;
  setResumePoint: (courseId: string, lessonId: string, seconds: number) => void;
  recordQuizScore: (courseId: string, quizId: string, score: number) => void;
  issueCertificate: (course: Course, score: number) => Certificate;
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  exportProfile: () => void;
  importProfile: (data: Profile) => void;
  startDemo: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(() => load<Profile[]>(PROFILES_KEY, []));
  const [activeId, setActiveId] = useState<string | null>(() => load<string | null>(ACTIVE_KEY, null));
  const [customCourses, setCustomCourses] = useState<Course[]>(() => load<Course[]>(CUSTOM_COURSES_KEY, []));
  const [demoInitialized, setDemoInitialized] = useState<boolean>(() => load<boolean>(DEMO_INIT_KEY, false));

  useEffect(() => {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }, [profiles]);
  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeId));
  }, [activeId]);
  useEffect(() => {
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(customCourses));
  }, [customCourses]);
  useEffect(() => {
    localStorage.setItem(DEMO_INIT_KEY, JSON.stringify(demoInitialized));
  }, [demoInitialized]);

  const courses = [...defaultCourses, ...customCourses];
  const activeProfile = profiles.find((p) => p.id === activeId) ?? null;

  function updateActive(mutator: (p: Profile) => Profile) {
    if (!activeId) return;
    setProfiles((prev) => prev.map((p) => (p.id === activeId ? mutator(structuredClone(p)) : p)));
  }

  function ensureProgress(p: Profile, courseId: string): CourseProgress {
    if (!p.progress[courseId]) p.progress[courseId] = emptyProgress(courseId);
    return p.progress[courseId];
  }

  const value: StoreContextType = {
    profiles,
    activeProfile,
    courses,
    customCourses,
    demoInitialized,
    startDemo() {
      if (demoInitialized) return;
      const seeded: Profile[] = demoProfiles.map((d) => ({
        ...d,
        createdAt: d.createdAt,
        progress: {},
        certificates: [],
      }));
      setProfiles(seeded);
      setActiveId(seeded[0].id);
      setDemoInitialized(true);
    },
    startDemo() {
      if (profiles.length > 0) {
        setActiveId(profiles[0].id);
        return;
      }
      const seeded: Profile[] = demoProfiles.map((d) => ({
        ...d,
        createdAt: d.createdAt,
        progress: {},
        certificates: [],
      }));
      setProfiles(seeded);
      setActiveId(seeded[0].id);
      setDemoInitialized(true);
    },
    createProfile(p) {
      const profile: Profile = {
        id: uid(),
        createdAt: Date.now(),
        progress: {},
        certificates: [],
        streak: 0,
        xp: 0,
        ...p,
      };
      setProfiles((prev) => [...prev, profile]);
      setActiveId(profile.id);
    },
    switchProfile(id) {
      setActiveId(id);
    },
    deleteProfile(id) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeId === id) setActiveId(null);
    },
    getProgress(courseId) {
      return activeProfile?.progress[courseId] ?? emptyProgress(courseId);
    },
    toggleLessonComplete(courseId, lessonId, complete) {
      updateActive((p) => {
        const prog = ensureProgress(p, courseId);
        const set = new Set(prog.completedLessons);
        if (complete) set.add(lessonId);
        else set.delete(lessonId);
        prog.completedLessons = [...set];
        prog.lastVisited = Date.now();
        p.xp += complete ? 25 : -25;
        p.streak = complete ? Math.max(p.streak, 1) : p.streak;
        return p;
      });
    },
    recordLessonView(courseId, lessonId) {
      updateActive((p) => {
        const prog = ensureProgress(p, courseId);
        prog.lessonViews[lessonId] = (prog.lessonViews[lessonId] ?? 0) + 1;
        prog.lastVisited = Date.now();
        return p;
      });
    },
    addLessonTime(courseId, lessonId, seconds) {
      if (seconds <= 0) return;
      updateActive((p) => {
        const prog = ensureProgress(p, courseId);
        prog.lessonTime[lessonId] = (prog.lessonTime[lessonId] ?? 0) + seconds;
        return p;
      });
    },
    setResumePoint(courseId, lessonId, seconds) {
      updateActive((p) => {
        const prog = ensureProgress(p, courseId);
        prog.resumePoints[lessonId] = seconds;
        return p;
      });
    },
    recordQuizScore(courseId, quizId, score) {
      updateActive((p) => {
        const prog = ensureProgress(p, courseId);
        prog.quizScores[quizId] = Math.max(prog.quizScores[quizId] ?? 0, score);
        prog.lastVisited = Date.now();
        p.xp += Math.round(score / 4);
        return p;
      });
    },
    issueCertificate(course, score) {
      const cert: Certificate = {
        id: "CERT-" + uid().toUpperCase(),
        courseId: course.id,
        courseTitle: course.title,
        studentName: activeProfile?.name ?? "Learner",
        date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
        score,
      };
      updateActive((p) => {
        if (!p.certificates.some((c) => c.courseId === course.id)) {
          p.certificates.push(cert);
          p.xp += 500;
        }
        return p;
      });
      const existing = activeProfile?.certificates.find((c) => c.courseId === course.id);
      return existing ?? cert;
    },
    addCourse(course) {
      setCustomCourses((prev) => {
        const without = prev.filter((c) => c.id !== course.id);
        return [...without, course];
      });
    },
    removeCourse(courseId) {
      setCustomCourses((prev) => prev.filter((c) => c.id !== courseId));
    },
    exportProfile() {
      if (!activeProfile) return;
      const blob = new Blob([JSON.stringify(activeProfile, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProfile.name.replace(/\s+/g, "-").toLowerCase()}-atlas-profile.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    importProfile(data) {
      const imported: Profile = { ...data, id: uid() };
      setProfiles((prev) => [...prev, imported]);
      setActiveId(imported.id);
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function courseLessonCount(course: Course) {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

export function coursePercent(course: Course, prog: CourseProgress) {
  const total = courseLessonCount(course);
  if (total === 0) return 0;
  const validIds = new Set(course.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const done = prog.completedLessons.filter((id) => validIds.has(id)).length;
  return Math.round((done / total) * 100);
}

export function courseIsComplete(course: Course, prog: CourseProgress) {
  return coursePercent(course, prog) === 100;
}