"use client";

import { Button } from "@/components/ui/button";
import { useCalendarSystem } from "@/lib/calendar-context";
import { Calendar } from "lucide-react";

export default function CalendarToggle() {
  const { calendarSystem, setCalendarSystem } = useCalendarSystem();
  console.log("🗓️ CalendarToggle rendering with system:", calendarSystem);

  const toggleCalendar = () => {
    console.log("🔄 Toggling calendar from", calendarSystem);
    try {
      setCalendarSystem(
        calendarSystem === "gregorian" ? "ethiopian" : "gregorian",
      );
    } catch (error) {
      console.error("❌ Error toggling calendar:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCalendar}
      className="gap-2 text-xs bg-white hover:bg-gray-50 border-gray-200"
    >
      <Calendar className="w-3 h-3" />
      {calendarSystem === "ethiopian" ? "የኢትዮጵያ" : "Gregorian"}
    </Button>
  );
}
