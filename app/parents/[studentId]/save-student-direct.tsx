"use client";

import { Button } from "@/components/ui/button";
import { Check, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function SaveStudentButton({
  studentId,
}: {
  studentId: string;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Check if student is already saved
  useEffect(() => {
    const checkIfSaved = () => {
      const savedChildren = JSON.parse(
        localStorage.getItem("children") || "[]",
      );
      console.log(
        "SaveStudentButton - Checking if student is saved:",
        studentId,
        savedChildren.includes(studentId),
      );
      setIsSaved(savedChildren.includes(studentId));
    };

    checkIfSaved();

    // Listen for storage changes in case user adds/removes from other tabs
    const handleStorageChange = () => {
      checkIfSaved();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [studentId]);

  const handleSaveStudent = async () => {
    console.log(
      "SaveStudentButton - Save button clicked for student:",
      studentId,
    );
    if (isSaved) return;

    setIsSaving(true);
    try {
      // Get current saved children from localStorage
      const currentChildren = JSON.parse(
        localStorage.getItem("children") || "[]",
      );
      console.log(
        "SaveStudentButton - Current saved children:",
        currentChildren,
      );

      // Add this student if not already present
      if (!currentChildren.includes(studentId)) {
        currentChildren.push(studentId);
        localStorage.setItem("children", JSON.stringify(currentChildren));
        console.log(
          "SaveStudentButton - Student saved successfully:",
          studentId,
        );

        // Update state
        setIsSaved(true);

        // Show saved confirmation briefly
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    } catch (error) {
      console.error("SaveStudentButton - Error saving student:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // If student is already saved, show saved indicator
  if (isSaved && !showSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
        <Check className="w-4 h-4" />
        Saved
      </div>
    );
  }

  // Show saving state
  if (isSaving) {
    return (
      <Button disabled className="gap-2" size="sm">
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Saving...
      </Button>
    );
  }

  // Show saved confirmation
  if (showSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium animate-pulse">
        <Check className="w-4 h-4" />
        Student Saved!
      </div>
    );
  }

  // Show save button
  return (
    <Button
      onClick={handleSaveStudent}
      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2"
      size="default"
    >
      <UserPlus className="w-4 h-4" />
      Save Student
    </Button>
  );
}
