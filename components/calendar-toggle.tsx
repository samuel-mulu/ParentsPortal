"use client";

import { Button } from "@/components/ui/button";
import { useCalendarSystem } from "@/lib/calendar-context";
import { Calendar } from "lucide-react";

export default function CalendarToggle() {
  const { calendarSystem, setCalendarSystem } = useCalendarSystem();

  const toggleCalendar = () => {
    setCalendarSystem(calendarSystem === "gregorian" ? "ethiopian" : "gregorian");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCalendar}
      className="gap-2 text-xs"
    >
      <Calendar className="w-3 h-3" />
      {calendarSystem === "ethiopian" ? "የኢትዮጵያ" : "Gregorian"}
    </Button>
  );
}
