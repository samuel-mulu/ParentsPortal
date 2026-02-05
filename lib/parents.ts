import { sql } from "@/lib/db";

export async function getChildrenByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  return sql`
    SELECT 
      "id",
      "firstName" || ' ' || "lastName" as full_name,
      "profileImageUrl" as photo_url,
      'Not Assigned' as grade
    FROM "Student"
    WHERE "id" = ANY(${ids})
      AND "parentsPortal" = true
  `;
}
