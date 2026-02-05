export default function HomeworkPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upcoming Homework</h2>
      <p className="text-muted-foreground text-sm">
        Assigned homework and projects will be listed here.
      </p>
      <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
        No homework assignments found yet.
      </div>
    </div>
  );
}
