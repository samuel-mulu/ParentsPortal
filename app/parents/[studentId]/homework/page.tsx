import { getHomeworkByStudentId } from "@/lib/students";
import HomeworkClient from "./homework-client";

export default async function HomeworkPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const homework = await getHomeworkByStudentId(studentId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Upcoming Homework</h2>
        <p className="text-sm text-muted-foreground">
          Filter by month or status to track your child&apos;s homework assignments.
        </p>
      </div>

      <HomeworkClient homework={homework as any} />
    </div>
  );
}
