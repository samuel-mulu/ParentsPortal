"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type TabKey = "attendance" | "homework" | "results" | "payments";

type StudentTabsProps = {
  studentId: string;
};

export default function StudentTabs({ studentId }: StudentTabsProps) {
  const segment = useSelectedLayoutSegment();
  const activeTab: TabKey =
    segment === "homework" || segment === "results" || segment === "payments"
      ? segment
      : "attendance";

  return (
    <nav aria-label="Student sections" className="px-2 pb-2">
      <div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
        <Link
          href={`/parents/${studentId}/attendance`}
          aria-current={activeTab === "attendance" ? "page" : undefined}
          className={
            "text-center text-xs font-medium rounded-md px-2 py-2 transition " +
            (activeTab === "attendance"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Attendance
        </Link>

        <Link
          href={`/parents/${studentId}/homework`}
          aria-current={activeTab === "homework" ? "page" : undefined}
          className={
            "text-center text-xs font-medium rounded-md px-2 py-2 transition " +
            (activeTab === "homework"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Homework
        </Link>

        <Link
          href={`/parents/${studentId}/results`}
          aria-current={activeTab === "results" ? "page" : undefined}
          className={
            "text-center text-xs font-medium rounded-md px-2 py-2 transition " +
            (activeTab === "results"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Results
        </Link>

        <Link
          href={`/parents/${studentId}/payments`}
          aria-current={activeTab === "payments" ? "page" : undefined}
          className={
            "text-center text-xs font-medium rounded-md px-2 py-2 transition " +
            (activeTab === "payments"
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:text-foreground")
          }
        >
          Payments
        </Link>
      </div>
    </nav>
  );
}
