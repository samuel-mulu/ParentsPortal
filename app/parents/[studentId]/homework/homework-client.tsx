"use client";

import CalendarToggle from "@/components/calendar-toggle";
import { Badge } from "@/components/ui/badge";
import { useCalendarSystem } from "@/lib/calendar-context";
import { formatDateForUI } from "@/lib/ethiopian-calendar";
import { useMemo, useState } from "react";

type HomeworkRecord = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  status: string;
  notes: string | null;
  class_name: string | null;
  subject_name: string | null;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: string; badgeCls: string; cardCls: string }
> = {
  done: {
    label: "Done",
    icon: "✅",
    badgeCls: "bg-green-100 text-green-700 border-green-200",
    cardCls: "border-l-green-500",
  },
  not_done: {
    label: "Not Done",
    icon: "❌",
    badgeCls: "bg-red-100 text-red-700 border-red-200",
    cardCls: "border-l-red-500",
  },
};

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status.toLowerCase()] ?? {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      icon: "📋",
      badgeCls: "bg-gray-100 text-gray-600 border-gray-200",
      cardCls: "border-l-gray-400",
    }
  );
}

function isDueSoon(date: string): boolean {
  const due = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

function isOverdue(date: string): boolean {
  const due = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export default function HomeworkClient({
  homework,
}: {
  homework: HomeworkRecord[];
}) {
  const { calendarSystem } = useCalendarSystem();
  // Derive filter options
  const subjects = useMemo(
    () =>
      Array.from(
        new Set(homework.map((r) => r.subject_name || "Unknown Subject")),
      ).sort(),
    [homework],
  );

  const statuses = useMemo(
    () =>
      Array.from(new Set(homework.map((r) => r.status.toLowerCase()))).sort(),
    [homework],
  );

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filtered = useMemo(
    () =>
      homework.filter((r) => {
        return (
          (selectedSubject === "all" ||
            (r.subject_name || "Unknown Subject") === selectedSubject) &&
          (selectedStatus === "all" ||
            r.status.toLowerCase() === selectedStatus)
        );
      }),
    [homework, selectedSubject, selectedStatus],
  );

  // Summary counts
  const summary = useMemo(() => {
    const counts: { done: number; not_done: number } = {
      done: 0,
      not_done: 0,
    };
    for (const r of homework) {
      const k = r.status.toLowerCase() as keyof typeof counts;
      if (k in counts) counts[k]++;
    }
    const total = homework.length;
    const pct = total > 0 ? Math.round((counts.done / total) * 100) : 0;
    return { ...counts, total, pct };
  }, [homework]);

  // Group filtered records by subject
  const grouped = useMemo(() => {
    const map: Record<string, HomeworkRecord[]> = {};
    for (const r of filtered) {
      const key = r.subject_name || "Unknown Subject";
      if (!map[key]) map[key] = [];
      map[key].push(r);
    }
    return map;
  }, [filtered]);

  if (homework.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed rounded-xl text-center text-muted-foreground">
        <div className="text-4xl mb-3">📚</div>
        <p className="font-medium">No upcoming homework assignments found.</p>
        <p className="text-sm mt-1">
          Assignments will appear here once they are added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header with Calendar Toggle ─────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Homework Assignments</h2>
        <CalendarToggle />
      </div>

      {/* ── Summary stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Done */}
        <div className="rounded-xl border border-l-4 border-l-green-500 bg-card p-4 flex flex-col gap-1 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">✅ Done</p>
          <p className="text-2xl font-bold text-green-600">{summary.done}</p>
          <p className="text-xs text-muted-foreground">assignments</p>
        </div>

        {/* Not Done */}
        <div className="rounded-xl border border-l-4 border-l-red-500 bg-card p-4 flex flex-col gap-1 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium">
            ❌ Not Done
          </p>
          <p className="text-2xl font-bold text-red-500">{summary.not_done}</p>
          <p className="text-xs text-muted-foreground">assignments</p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────── */}
      <div className="bg-muted/40 rounded-xl p-4 space-y-3 border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Filter Assignments
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Subject */}
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              � Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              📋 Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {getStatusConfig(s).icon} {getStatusConfig(s).label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(selectedSubject !== "all" || selectedStatus !== "all") && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedSubject("all");
                  setSelectedStatus("all");
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
        Showing <strong>{filtered.length}</strong> assignment
        {filtered.length !== 1 && "s"}
        {selectedSubject !== "all" && (
          <>
            {" "}
            for <strong>{selectedSubject}</strong>
          </>
        )}
        {selectedStatus !== "all" && (
          <>
            {" · "}
            <span className="capitalize">{selectedStatus}</span> only
          </>
        )}
      </p>

      {/* ── No match ────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground">
          <div className="text-3xl mb-2">🔍</div>
          <p>No assignments match your filters.</p>
        </div>
      )}

      {/* ── Grouped by subject ─────────────────────────── */}
      {Object.entries(grouped).map(([subject, records]) => {
        const sDone = records.filter(
          (r) => r.status.toLowerCase() === "done",
        ).length;
        const sNotDone = records.filter(
          (r) => r.status.toLowerCase() === "not_done",
        ).length;

        return (
          <div key={subject} className="space-y-2">
            {/* Subject header */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                � {subject}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Subject mini summary */}
            <div className="flex gap-2 flex-wrap text-xs text-muted-foreground px-1 pb-1">
              {sDone > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {sDone} done
                </span>
              )}
              {sNotDone > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  {sNotDone} not done
                </span>
              )}
            </div>

            {/* Assignment cards */}
            <div className="rounded-xl border overflow-hidden divide-y">
              {records.map((record) => {
                const cfg = getStatusConfig(record.status);
                const dueSoon = isDueSoon(record.date);
                const overdue = isOverdue(record.date);

                return (
                  <div
                    key={record.id}
                    className={`flex items-start gap-4 px-4 py-3 border-l-4 bg-card ${cfg.cardCls}`}
                  >
                    {/* Day + date */}
                    <div className="w-24 shrink-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-sm font-medium leading-tight">
                        {calendarSystem === "ethiopian"
                          ? formatDateForUI(record.date, calendarSystem)
                          : new Date(record.date).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                      </p>
                      {dueSoon && !overdue && (
                        <p className="text-xs text-yellow-600 font-medium mt-1">
                          Due Soon
                        </p>
                      )}
                      {overdue && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                          Overdue
                        </p>
                      )}
                    </div>

                    {/* Title + details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight">
                        {record.title}
                      </p>
                      {record.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {record.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                        {record.subject_name && (
                          <span className="font-medium">
                            {record.subject_name}
                          </span>
                        )}
                        {record.class_name && (
                          <span>· {record.class_name}</span>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          {record.notes}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold border shrink-0 ${cfg.badgeCls}`}
                    >
                      {cfg.icon} {cfg.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
