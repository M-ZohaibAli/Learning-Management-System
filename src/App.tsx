"use client";

import { RouterProvider, useRoute, Link } from "./router";
import { StoreProvider } from "./store/store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import LessonViewer from "./pages/LessonViewer";
import QuizPage from "./pages/QuizPage";
import Dashboard from "./pages/Dashboard";
import CertificatePage from "./pages/CertificatePage";
import Profiles from "./pages/Profiles";
import Instructor from "./pages/Instructor";

function Routes() {
  const { segments } = useRoute();

  if (segments.length === 0) return <Home />;

  switch (segments[0]) {
    case "course": {
      const courseId = segments[1];
      if (!courseId) return <Home />;
      if (segments[2] === "lesson" && segments[3]) {
        return <LessonViewer courseId={courseId} lessonId={segments[3]} />;
      }
      if (segments[2] === "quiz" && segments[3]) {
        return <QuizPage courseId={courseId} moduleId={segments[3]} />;
      }
      return <CourseDetail courseId={courseId} />;
    }
    case "certificate":
      return segments[1] ? <CertificatePage courseId={segments[1]} /> : <Home />;
    case "dashboard":
      return <Dashboard />;
    case "instructor":
      return <Instructor />;
    case "profiles":
      return <Profiles />;
    default:
      return <Home />;
  }
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200/70 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7l10-5 10 5-10 5L2 7z" />
                <path d="M6 10v5c0 1 3 3 6 3s6-2 6-3v-5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg font-bold tracking-tight text-ink-900">Atlas</span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-400">LMS</span>
            </div>
          </div>
           <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
             A modern learning platform that runs entirely in your browser. Built for educators, learners, and
             independent creators who value privacy and simplicity.
           </p>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Learn</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="text-ink-700 hover:text-ink-900">Catalog</Link></li>
            <li><Link to="/dashboard" className="text-ink-700 hover:text-ink-900">Dashboard</Link></li>
            <li><Link to="/profiles" className="text-ink-700 hover:text-ink-900">Profiles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Build</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/instructor" className="text-ink-700 hover:text-ink-900">Instructor studio</Link></li>
            <li><span className="text-ink-400">JSON export / import</span></li>
            <li><span className="text-ink-400">Static hosting ready</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Atlas LMS. Crafted with care.</p>
           <p className="font-mono">v1.0 · client-side</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <div className="flex min-h-screen flex-col bg-ink-50 text-ink-900">
          <Navbar />
          <main className="flex-1">
            <Routes />
          </main>
          <Footer />
        </div>
      </StoreProvider>
    </RouterProvider>
  );
}