import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sql } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import StudentTabs from "./student-tabs";

type StudentRow = {
  id: string;
  full_name: string;
  photo_url: string | null;
  grade: string;
  parent_portal: boolean;
};

export default async function StudentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  const rows = await sql`
    SELECT 
      "id", 
      "firstName" || ' ' || "lastName" as full_name, 
      "profileImageUrl" as photo_url, 
      'Not Assigned' as grade, 
      "parentsPortal" as parent_portal
    FROM "Student"
    WHERE "id" = ${studentId}
    LIMIT 1
  `;

  const student = rows[0] as StudentRow | undefined;

  // If student doesn't exist or parent portal access is disabled, send the parent back.
  if (!student || !student.parent_portal) {
    redirect("/parents");
  }

  const studentInitial = student.full_name?.trim()?.[0]?.toUpperCase() ?? "S";

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 border-b">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Link
              href="/parents"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>

            <div className="h-12 w-12 relative">
              {student.photo_url ? (
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={student.photo_url}
                    alt={student.full_name}
                  />
                  <AvatarFallback>{studentInitial}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <img
                    src="/logo.jpg"
                    alt="Student"
                    className="h-10 w-10 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="font-bold leading-tight truncate">
                {student.full_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Grade {student.grade}
              </p>
            </div>
          </div>
        </div>

        <StudentTabs studentId={student.id} />
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
