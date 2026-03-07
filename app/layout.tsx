import { CalendarProvider } from "@/lib/calendar-context";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <CalendarProvider>{children}</CalendarProvider>
      </body>
    </html>
  );
}
