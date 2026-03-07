"use client";

import { Badge } from "@/components/ui/badge";
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    monthKey: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

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
  // Derive filter options
  const months = useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const r of homework) {
      const key = formatDate(r.date).monthKey;
      if (!seen.has(key)) {
        seen.add(key);
        order.push(key);
      }
    }
    return order;
  }, [homework]);

  const statuses = useMemo(
    () =>
      Array.from(new Set(homework.map((r) => r.status.toLowerCase()))).sort(),
    [homework],
  );

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filtered = useMemo(
    () =>
      homework.filter((r) => {
        const { monthKey } = formatDate(r.date);
        return (
          (selectedMonth === "all" || monthKey === selectedMonth) &&
          (selectedStatus === "all" ||
            r.status.toLowerCase() === selectedStatus)
        );
      }),
    [homework, selectedMonth, selectedStatus],
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

  // Group filtered records by month
  const grouped = useMemo(() => {
    const map: Record<string, HomeworkRecord[]> = {};
    for (const r of filtered) {
      const key = formatDate(r.date).monthKey;
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
      {/* ── Summary stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Completion Rate */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border bg-card p-4 flex flex-col gap-1 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Completion Rate
          </p>
          <p
            className={`text-3xl font-bold ${
              summary.pct >= 80
                ? "text-green-600"
                : summary.pct >= 50
                  ? "text-yellow-600"
                  : "text-red-500"
            }`}
          >
            {summary.pct}%
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.total} total assignments
          </p>
        </div>

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
          {/* Month */}
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              📅 Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
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
          {(selectedMonth !== "all" || selectedStatus !== "all") && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedMonth("all");
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
        {selectedMonth !== "all" && (
          <>
            {" "}
            for <strong>{selectedMonth}</strong>
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

      {/* ── Grouped by month ─────────────────────────── */}
      {Object.entries(grouped).map(([month, records]) => {
        const mDone = records.filter(
          (r) => r.status.toLowerCase() === "done",
        ).length;
        const mNotDone = records.filter(
          (r) => r.status.toLowerCase() === "not_done",
        ).length;

        return (
          <div key={month} className="space-y-2">
            {/* Month header */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                📅 {month}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Month mini summary */}
            <div className="flex gap-2 flex-wrap text-xs text-muted-foreground px-1 pb-1">
              {mDone > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {mDone} done
                </span>
              )}
              {mNotDone > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  {mNotDone} not done
                </span>
              )}
            </div>

            {/* Assignment cards */}
            <div className="rounded-xl border overflow-hidden divide-y">
              {records.map((record) => {
                const { day, date } = formatDate(record.date);
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
                        {day}
                      </p>
                      <p className="text-sm font-medium leading-tight">
                        {date}
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
