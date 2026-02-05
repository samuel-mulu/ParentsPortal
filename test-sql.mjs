import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const studentId = '010be945-8bdd-4dc8-b8a9-ec5787ad77cc';
  try {
    const result = await sql`
      SELECT
        "id",
        "firstName",
        "lastName",
        "profileImageUrl" as photo_url,
        "parentsPortal" as parent_portal
      FROM "Student"
      WHERE "id" = ${studentId}
    `;
    console.log("RESULT:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

run();
