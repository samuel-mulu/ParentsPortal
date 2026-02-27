"use client";

import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";

type Mark = {
  id: string;
  score: number;
  max_score: number;
  grade: string | null;
  subject_name: string;
  term_name: string;
  exam_name: string;
};

function getGradeColor(grade: string | null) {
  if (!grade) return "bg-gray-100 text-gray-600 border-gray-200";
  const g = grade.toUpperCase();
  if (g === "A+" || g === "A") return "bg-green-100 text-green-700 border-green-200";
  if (g === "A-" || g === "B+") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (g === "B" || g === "B-") return "bg-blue-100 text-blue-700 border-blue-200";
  if (g === "C+" || g === "C") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (g === "C-" || g === "D") return "bg-orange-100 text-orange-700 border-orange-200";
  if (g === "F") return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

export default function ResultsClient({ results }: { results: Mark[] }) {
  // Derive unique filter options
  const terms = useMemo(
    () => Array.from(new Set(results.map((r) => r.term_name))).sort(),
    [results]
  );
  const subjects = useMemo(
    () => Array.from(new Set(results.map((r) => r.subject_name))).sort(),
    [results]
  );

  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const filtered = useMemo(
    () =>
      results.filter(
        (r) =>
          (selectedTerm === "all" || r.term_name === selectedTerm) &&
          (selectedSubject === "all" || r.subject_name === selectedSubject)
      ),
    [results, selectedTerm, selectedSubject]
  );

  // Group by term → subject
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, Mark[]>> = {};
    for (const mark of filtered) {
      if (!map[mark.term_name]) map[mark.term_name] = {};
      if (!map[mark.term_name][mark.subject_name])
        map[mark.term_name][mark.subject_name] = [];
      map[mark.term_name][mark.subject_name].push(mark);
    }
    return map;
  }, [filtered]);

  if (results.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-medium">No exam results published yet.</p>
        <p className="text-sm mt-1">Results will appear here once they are released.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Filters ─────────────────────────────────────── */}
      <div className="bg-muted/40 rounded-xl p-4 space-y-3 border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter Results
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Term filter */}
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              📅 Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Terms</option>
              {terms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Subject filter */}
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              📚 Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(selectedTerm !== "all" || selectedSubject !== "all") && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedTerm("all");
                  setSelectedSubject("all");
                }}
                className="px-4 py-2 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Record count ─────────────────────────────── */}
      <p className="text-sm text-muted-foreground">
        Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 && "s"}
      </p>

      {/* ── No match message ─────────────────────────── */}
      {filtered.length === 0 && (
        <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
          <div className="text-3xl mb-2">🔍</div>
          <p>No results match your filters.</p>
        </div>
      )}

      {/* ── Grouped results ──────────────────────────── */}
      {Object.entries(grouped).map(([term, subjectMap]) => (
        <div key={term} className="space-y-3">
          {/* Term header */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
              📅 {term}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Subject cards */}
          {Object.entries(subjectMap).map(([subject, marks]) => (
            <div
              key={subject}
              className="rounded-xl border bg-card shadow-sm overflow-hidden"
            >
              {/* Subject header */}
              <div className="px-4 py-3 bg-muted/30 border-b">
                <span className="text-base font-semibold">📚 {subject}</span>
              </div>

              {/* Column labels */}
              <div className="grid grid-cols-[1fr_auto_auto] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b bg-muted/10">
                <span>Exam</span>
                <span className="w-24 text-center">Score</span>
                <span className="w-14 text-center">Grade</span>
              </div>

              {/* Exam rows */}
              <div className="divide-y">
                {marks.map((mark) => (
                  <div
                    key={mark.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-3 gap-3"
                  >
                    {/* Exam name */}
                    <p className="text-sm font-medium truncate">{mark.exam_name}</p>

                    {/* Score */}
                    <div className="w-24 text-center">
                      <span className="text-sm font-bold">{mark.score}</span>
                      <span className="text-xs text-muted-foreground"> / {mark.max_score}</span>
                    </div>

                    {/* Grade badge */}
                    <div className="w-14 flex justify-center">
                      <Badge
                        variant="outline"
                        className={`text-sm font-bold border ${getGradeColor(mark.grade)}`}
                      >
                        {mark.grade ?? "N/A"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
