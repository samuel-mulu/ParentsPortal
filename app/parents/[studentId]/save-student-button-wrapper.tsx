"use client";

import SaveStudentButtonClient from "./save-student-button";

type SaveStudentButtonProps = {
  studentId: string;
};

export default function SaveStudentButton({
  studentId,
}: SaveStudentButtonProps) {
  return <SaveStudentButtonClient studentId={studentId} />;
}
