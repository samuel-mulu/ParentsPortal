import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function verifyStudentById(studentId: string) {
  console.log("🔍 verifyStudentById called with:", studentId);

  try {
    const rows = await sql`
      SELECT
        "id",
        "firstName" as first_name,
        "lastName" as last_name,
        "profileImageUrl" as photo_url,
        "parentsPortal" as parent_portal
      FROM "Student"
      WHERE "id" = ${studentId}
      LIMIT 1
    `;

    console.log("📊 Database query result:", rows);
    const student = rows[0];

    if (!student) {
      console.log("❌ No student found");
      return null;
    }

    if (!student.parent_portal) {
      console.log("❌ Parents portal access disabled");
      return null;
    }

    console.log("✅ Student verified successfully");
    return {
      id: student.id,
      full_name: `${student.first_name} ${student.last_name}`,
      photo_url: student.photo_url,
      grade: "Not Assigned", // You can enhance this later
      parent_portal: student.parent_portal,
    };
  } catch (error) {
    console.error("💥 Database error in verifyStudentById:", error);
    throw error;
  }
}

export async function getAttendanceByStudentId(studentId: string) {
  try {
    return await sql`
      SELECT 
        a.id,
        a.date,
        a.status,
        a.notes,
        c.name as class_name
      FROM "Attendance" a
      LEFT JOIN "Class" c ON a."classId" = c.id
      WHERE a."studentId" = ${studentId}
      ORDER BY a.date DESC
    `;
  } catch (error) {
    console.error("💥 Database error in getAttendanceByStudentId:", error);
    throw error;
  }
}

export async function getPaymentsByStudentId(studentId: string) {
  try {
    return await sql`
      SELECT 
        p.id,
        p.amount,
        p.month,
        p.year,
        p.status,
        p."paymentDate" as payment_date,
        p."paymentMethod" as payment_method,
        pt.name as payment_type
      FROM "Payment" p
      LEFT JOIN "PaymentType" pt ON p."paymentTypeId" = pt.id
      WHERE p."studentId" = ${studentId}
      ORDER BY p.year DESC, p.month DESC
    `;
  } catch (error) {
    console.error("💥 Database error in getPaymentsByStudentId:", error);
    throw error;
  }
}

export async function getResultsByStudentId(studentId: string) {
  try {
    return await sql`
      SELECT 
        m.id,
        m.score,
        m."maxScore" as max_score,
        m.grade,
        s.name as subject_name,
        t.name as term_name,
        se.name as exam_name
      FROM "Mark" m
      LEFT JOIN "Subject" s ON m."subjectId" = s.id
      LEFT JOIN "Term" t ON m."termId" = t.id
      LEFT JOIN "SubExam" se ON m."subExamId" = se.id
      WHERE m."studentId" = ${studentId}
      ORDER BY t.name DESC, s.name ASC
    `;
  } catch (error) {
    console.error("💥 Database error in getResultsByStudentId:", error);
    throw error;
  }
}
