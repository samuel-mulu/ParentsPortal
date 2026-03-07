"use client";

import { Button } from "@/components/ui/button";
import { useChildrenIds } from "@/lib/useChildren";
import { Check, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

type SaveStudentButtonProps = {
  studentId: string;
};

export default function SaveStudentButton({
  studentId,
}: SaveStudentButtonProps) {
  const savedChildrenIds = useChildrenIds();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Check if student is already saved
  useEffect(() => {
    setIsSaved(savedChildrenIds.includes(studentId));
  }, [savedChildrenIds, studentId]);

  const handleSaveStudent = async () => {
    if (isSaved) return;

    setIsSaving(true);
    try {
      // Get current saved children from localStorage
      const currentChildren = JSON.parse(
        localStorage.getItem("children") || "[]",
      );

      // Add this student if not already present
      if (!currentChildren.includes(studentId)) {
        currentChildren.push(studentId);
        localStorage.setItem("children", JSON.stringify(currentChildren));

        // Update state
        setIsSaved(true);

        // Show saved confirmation briefly
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // If student is already saved, don't show anything or show a saved indicator
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
      <Button disabled className="gap-2">
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
      className="gap-2 bg-blue-600 hover:bg-blue-700"
      size="sm"
    >
      <UserPlus className="w-4 h-4" />
      Save Student
    </Button>
  );
}
