import { format, parseISO } from "date-fns";
import Kenat from "kenat";

export type CalendarSystem = "gregorian" | "ethiopian";

/**
 * Convert Gregorian ISO date string to Ethiopian date object
 */
export function gregorianToEthiopian(
  dateISO: string | Date | null | undefined,
): {
  year: number;
  month: number;
  day: number;
} {
  try {
    // Handle null/undefined
    if (!dateISO) {
      const today = new Kenat();
      return today.getEthiopian();
    }

    // Convert Date object to ISO string if needed
    let dateString: string;
    if (dateISO instanceof Date) {
      dateString = dateISO.toISOString();
    } else if (typeof dateISO === "string") {
      dateString = dateISO;
    } else {
      const today = new Kenat();
      return today.getEthiopian();
    }

    const date = parseISO(dateString);
    const kenat = new Kenat(date);
    const ethiopian = kenat.getEthiopian();
    return {
      year: ethiopian.year,
      month: ethiopian.month,
      day: ethiopian.day,
    };
  } catch (error) {
    console.error(
      "Error converting Gregorian to Ethiopian:",
      error,
      "Input:",
      dateISO,
    );
    // Fallback to current date if conversion fails
    const today = new Kenat();
    return today.getEthiopian();
  }
}

/**
 * Format date for UI display based on calendar system
 * If Gregorian: returns formatted date using date-fns
 * If Ethiopian: converts to Ethiopian and formats with Amharic month names
 */
export function formatDateForUI(
  dateISO: string | Date | null | undefined,
  system: CalendarSystem,
): string {
  try {
    // Handle null/undefined
    if (!dateISO) {
      return "Invalid Date";
    }

    // Convert Date object to ISO string if needed
    let dateString: string;
    if (dateISO instanceof Date) {
      dateString = dateISO.toISOString();
    } else if (typeof dateISO === "string") {
      dateString = dateISO;
    } else {
      return "Invalid Date";
    }

    if (system === "gregorian") {
      const date = parseISO(dateString);
      return format(date, "MMMM yyyy");
    } else {
      // Ethiopian calendar
      const kenat = new Kenat(parseISO(dateString));
      const ethiopian = kenat.getEthiopian();
      const monthName = getEthiopianMonthNameAmharic(ethiopian.month);

      return `${monthName} ${ethiopian.year}`;
    }
  } catch (error) {
    console.error("Error formatting date for UI:", error, "Input:", dateISO);
    return "Invalid Date";
  }
}

/**
 * Format date with full details for Ethiopian calendar
 */
export function formatEthiopianDateFull(
  dateISO: string | Date | null | undefined,
): string {
  try {
    // Handle null/undefined
    if (!dateISO) {
      return "Invalid Date";
    }

    // Convert Date object to ISO string if needed
    let dateString: string;
    if (dateISO instanceof Date) {
      dateString = dateISO.toISOString();
    } else if (typeof dateISO === "string") {
      dateString = dateISO;
    } else {
      return "Invalid Date";
    }

    const kenat = new Kenat(parseISO(dateString));
    const ethiopian = kenat.getEthiopian();
    const monthName = getEthiopianMonthNameAmharic(ethiopian.month);

    // Get weekday name in Amharic
    const date = parseISO(dateString);
    const amharicWeekdays = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"];
    const weekday = amharicWeekdays[date.getDay()];

    return `${weekday}፣ ${monthName} ${ethiopian.day} ቀን ${ethiopian.year}`;
  } catch (error) {
    console.error("Error formatting Ethiopian date:", error, "Input:", dateISO);
    return "Invalid Date";
  }
}

/**
 * Format simple date (day, month name, year) for Ethiopian calendar
 */
export function formatEthiopianDateSimple(
  dateISO: string | Date | null | undefined,
): string {
  try {
    // Handle null/undefined
    if (!dateISO) {
      return "Invalid Date";
    }

    // Convert Date object to ISO string if needed
    let dateString: string;
    if (dateISO instanceof Date) {
      dateString = dateISO.toISOString();
    } else if (typeof dateISO === "string") {
      dateString = dateISO;
    } else {
      return "Invalid Date";
    }

    const kenat = new Kenat(parseISO(dateString));
    const ethiopian = kenat.getEthiopian();
    const monthName = getEthiopianMonthNameAmharic(ethiopian.month);

    return `${monthName} ${ethiopian.day}፣ ${ethiopian.year}`;
  } catch (error) {
    console.error("Error formatting Ethiopian date:", error, "Input:", dateISO);
    return "Invalid Date";
  }
}

/**
 * Get Ethiopian month names in Amharic script
 */
export function getEthiopianMonthNameAmharic(month: number): string {
  const months = [
    "መስከርም", // Meskerem (September)
    "ጥቅምት", // Tikimt (October)
    "ሕዳር", // Hidar (November)
    "ታኅሣሥ", // Tahsas (December)
    "ጥር", // Tir (January)
    "የካቲት", // Yekatit (February)
    "መጋቢት", // Megabit (March)
    "ሚያዝያ", // Miazia (April)
    "ግንቦት", // Ginbot (May)
    "ሰኔ", // Sene (June)
    "ሐምሌ", // Hamle (July)
    "ነሐሴ", // Nehase (August)
    "ጳጉሜ", // Pagume (September 6-10)
  ];
  return months[month - 1] || `Month ${month}`;
}

/**
 * Get Ethiopian month names in English
 */
export function getEthiopianMonthNameEnglish(month: number): string {
  const months = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miazia",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
  ];
  return months[month - 1] || `Month ${month}`;
}

/**
 * Get Amharic weekday names
 */
export function getAmharicWeekday(dayIndex: number): string {
  const weekdays = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"];
  return weekdays[dayIndex] || "";
}

/**
 * Convert Gregorian month/year to Ethiopian month/year for grouping
 */
export function getEthiopianMonthKey(
  dateISO: string | Date | null | undefined,
): string {
  try {
    const ethiopian = gregorianToEthiopian(dateISO);
    const monthName = getEthiopianMonthNameAmharic(ethiopian.month);
    return `${monthName} ${ethiopian.year}`;
  } catch (error) {
    console.error(
      "Error getting Ethiopian month key:",
      error,
      "Input:",
      dateISO,
    );
    return "Invalid Date";
  }
}
