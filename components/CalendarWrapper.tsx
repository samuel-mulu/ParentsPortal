"use client";

import { CalendarProvider } from "@/lib/calendar-context";
import { ReactNode } from "react";

export default function CalendarWrapper({ children }: { children: ReactNode }) {
  return <CalendarProvider>{children}</CalendarProvider>;
}
