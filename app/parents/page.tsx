import Link from "next/link";
import ChildrenList from "./children-list";

export default function ParentsPage() {
  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My Children</h1>

        <Link href="/parents/add-child" className="text-sm underline">
          + Add
        </Link>
      </div>

      <ChildrenList />
    </main>
  );
}
