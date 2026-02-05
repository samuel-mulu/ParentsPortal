import { verifyStudentById } from "@/lib/students";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🚀 API route called: /parents/api/verify-child");

  try {
    const { studentId } = await req.json();
    console.log("📥 Received studentId:", studentId);

    // Simple validation - just check if studentId exists
    if (
      !studentId ||
      typeof studentId !== "string" ||
      studentId.trim().length === 0
    ) {
      console.log("❌ Invalid studentId received");
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    const trimmedId = studentId.trim();
    console.log("🔍 Looking up student:", trimmedId);

    const student = await verifyStudentById(trimmedId);
    console.log("📊 Database result:", student);

    if (!student) {
      console.log("❌ Student not found or parents portal disabled");
      return NextResponse.json(
        { error: "Student not found or parents portal access is disabled" },
        { status: 404 },
      );
    }

    console.log("✅ Student found and has parents portal access");

    // Success response
    return NextResponse.json({
      success: true,
      message: "Student verified successfully",
      data: {
        id: student.id,
        fullName: student.full_name,
        hasParentsPortal: student.parent_portal,
      },
    });
  } catch (error) {
    console.error("💥 API Error:", error);
    console.error("💥 Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
