"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Link } from "../router";
import { courseIsComplete, coursePercent, useStore } from "../store/store";
import { Badge } from "../components/ui";
import { Award, Download, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function CertificatePage({ courseId }: { courseId: string }) {
  const { courses, getProgress, activeProfile, issueCertificate } = useStore();
  const course = courses.find((c) => c.id === courseId);
  const [cert, setCert] = useState(activeProfile?.certificates.find((c) => c.courseId === courseId) ?? null);

  const prog = getProgress(courseId);
  const complete = course ? courseIsComplete(course, prog) : false;
  const pct = course ? coursePercent(course, prog) : 0;

  useEffect(() => {
    if (course && complete && activeProfile && !cert) {
      setCert(issueCertificate(course, pct));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, complete, activeProfile]);

  if (!course) {
    return <div className="px-4 py-20 text-center text-ink-600">Course not found.</div>;
  }

  if (!activeProfile) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-600">Create a profile to claim certificates.</p>
        <Link to="/profiles" className="mt-4 inline-flex text-accent-600 hover:underline">Create profile →</Link>
      </div>
    );
  }

  if (!complete) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
          <Lock size={26} strokeWidth={2} />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold text-ink-900">Certificate locked</h1>
        <p className="mt-2 text-ink-500">Complete all lessons in "{course.title}" to unlock your certificate.</p>
        <Link
          to={`/course/${course.id}`}
          className="mt-5 inline-flex rounded-2xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Back to course
        </Link>
      </div>
    );
  }

  const data = cert ?? {
    id: "CERT-PENDING",
    studentName: activeProfile.name,
    courseTitle: course.title,
    date: new Date().toLocaleDateString(),
    score: pct,
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, w, h, "F");
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(2);
    doc.rect(10, 10, w - 20, h - 20);
    doc.setLineWidth(0.5);
    doc.rect(14, 14, w - 28, h - 28);

    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ATLAS LMS · CERTIFICATE OF COMPLETION", w / 2, 36, { align: "center" });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("This is proudly presented to", w / 2, 66, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text(data.studentName, w / 2, 88, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("for successfully completing the course", w / 2, 104, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text(data.courseTitle, w / 2, 120, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Instructor: ${course.instructor}`, w / 2, 134, { align: "center" });

    doc.setDrawColor(203, 213, 225);
    doc.line(40, h - 40, 110, h - 40);
    doc.line(w - 110, h - 40, w - 40, h - 40);
    doc.setFontSize(10);
    doc.text(`Date: ${data.date}`, 75, h - 34, { align: "center" });
    doc.text(`ID: ${data.id}`, w - 75, h - 34, { align: "center" });

    doc.save(`atlas-certificate-${course.id}.pdf`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to={`/course/${course.id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900">
        ← Back to course
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] border-8 border-double border-amber-200 bg-gradient-to-br from-white via-amber-50/40 to-white p-8 shadow-2xl shadow-amber-500/10 sm:p-14"
      >
        {/* Decorative corners */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-8 top-8 h-16 w-16 border-l-2 border-t-2 border-amber-300" />
          <div className="absolute right-8 top-8 h-16 w-16 border-r-2 border-t-2 border-amber-300" />
          <div className="absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-amber-300" />
          <div className="absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-amber-300" />
        </div>

        <div className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
            <Award size={26} strokeWidth={2} />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-amber-700">Certificate of Completion</p>
          <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <p className="mt-8 text-sm uppercase tracking-widest text-ink-500">This is proudly presented to</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-ink-900 sm:text-6xl">{data.studentName}</h1>

          <p className="mt-8 text-sm text-ink-500">for successfully completing</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-amber-700">{data.courseTitle}</h2>
          <p className="mt-3 text-sm text-ink-500">with a final score of {data.score}%</p>
          <p className="mt-1 text-sm text-ink-500">Instructor · {course.instructor}</p>

          <div className="mt-10 flex items-center justify-between text-xs text-ink-500">
            <div className="text-left">
              <p className="border-t border-ink-300 pt-1.5 font-mono text-[11px] font-semibold text-ink-700">{data.date}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider">Date issued</p>
            </div>
            <div className="text-center">
              <Award size={28} className="mx-auto text-amber-500" strokeWidth={1.6} />
            </div>
            <div className="text-right">
              <p className="border-t border-ink-300 pt-1.5 font-mono text-[10px] font-semibold text-ink-700">{data.id}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider">Certificate ID</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={downloadPdf}
          className="inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 active:scale-[0.98]"
        >
          <Download size={16} strokeWidth={2.2} /> Download PDF
        </button>
        <Link
          to="/dashboard"
          className="rounded-2xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 active:scale-[0.98]"
        >
          Go to dashboard
        </Link>
        <Badge tone="accent">Verified by Atlas LMS</Badge>
      </div>
    </div>
  );
}