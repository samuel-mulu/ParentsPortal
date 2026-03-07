"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import type { CalendarSystem } from "./ethiopian-calendar";

interface CalendarContextType {
  calendarSystem: CalendarSystem;
  setCalendarSystem: (system: CalendarSystem) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

export function useCalendarSystem() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendarSystem must be used within a CalendarProvider");
  }
  return context;
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [calendarSystem, setCalendarSystemState] = useState<CalendarSystem>(
    () => {
      // Initialize from localStorage synchronously
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("calendarSystem");
          return stored === "gregorian" || stored === "ethiopian"
            ? stored
            : "gregorian";
        } catch (error) {
          console.warn(
            "Failed to load calendar system from localStorage:",
            error,
          );
          return "gregorian";
        }
      }
      return "gregorian";
    },
  );

  const setCalendarSystem = (system: CalendarSystem) => {
    try {
      localStorage.setItem("calendarSystem", system);
      setCalendarSystemState(system);
    } catch (error) {
      // Still update state even if localStorage fails
      console.warn("Failed to save calendar system to localStorage:", error);
      setCalendarSystemState(system);
    }
  };

  return (
    <CalendarContext.Provider value={{ calendarSystem, setCalendarSystem }}>
      {children}
    </CalendarContext.Provider>
  );
}
