"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddChildPage() {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    console.log(" Submit button clicked");
    console.log(" Student ID:", studentId);

    if (!studentId.trim()) {
      console.log(" Empty student ID");
      setError("Please enter student ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log(" Making API call to /parents/api/verify-child");
      console.log(" Request body:", { studentId: studentId.trim() });

      const res = await fetch("/parents/api/verify-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentId.trim() }),
      });

      console.log(" Response status:", res.status);
      console.log(
        " Response headers:",
        Object.fromEntries(res.headers.entries()),
      );

      const data = await res.json();
      console.log(" Response data:", data);

      if (!data.success) {
        console.log(" API returned error:", data.error);
        setError(data.error || "Student not found");
        return;
      }

      console.log(" API call successful");
      setSuccess("Child added successfully!");

      // Save to localStorage
      const children = JSON.parse(localStorage.getItem("children") || "[]");
      console.log(" Current children:", children);

      if (!children.includes(data.data.id)) {
        children.push(data.data.id);
        localStorage.setItem("children", JSON.stringify(children));
        console.log(" Updated children:", children);
      }

      // Redirect after 2 seconds
      setTimeout(() => router.push("/parents"), 2000);
    } catch (err) {
      console.error(" Frontend error:", err);
      console.error(" Error details:", {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        studentId: studentId.trim(),
      });
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
      console.log(" Loading state reset");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Add Child</h1>
        <p className="text-gray-600 mb-6">Enter your child's student ID</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setError("");
              }}
              placeholder="Enter student ID"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !studentId.trim()}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isLoading || !studentId.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Adding..." : "Add Child"}
          </button>
        </div>

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
