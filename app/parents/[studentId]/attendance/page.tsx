import { getAttendanceByStudentId } from "@/lib/students";
import AttendanceClient from "./attendance-client";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const attendance = await getAttendanceByStudentId(studentId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Attendance History</h2>
        <p className="text-sm text-muted-foreground">
          Filter by month or status to track your child&apos;s attendance.
        </p>
      </div>

      <AttendanceClient attendance={attendance as any} />
    </div>
  );
}
