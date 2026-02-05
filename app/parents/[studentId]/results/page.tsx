import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getResultsByStudentId } from "@/lib/students";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const results = await getResultsByStudentId(studentId);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Exam Results</h2>

      {results.length === 0 ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          No exam results published yet.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((mark: any) => (
                <TableRow key={mark.id}>
                  <TableCell className="font-medium">{mark.subject_name}</TableCell>
                  <TableCell>{mark.exam_name}</TableCell>
                  <TableCell>{mark.term_name}</TableCell>
                  <TableCell>
                    {mark.score} / {mark.max_score}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {mark.grade || "N/A"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
