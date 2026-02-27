import { getResultsByStudentId } from "@/lib/students";
import ResultsClient from "./results-client";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const results = await getResultsByStudentId(studentId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Exam Results</h2>
        <p className="text-sm text-muted-foreground">
          View and filter your child&apos;s exam results by term or subject.
        </p>
      </div>

      <ResultsClient results={results as any} />
    </div>
  );
}
