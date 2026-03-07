"use client";

import CalendarToggle from "@/components/calendar-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCalendarSystem } from "@/lib/calendar-context";
import { formatDateForUI } from "@/lib/ethiopian-calendar";

export default function ClientPaymentsPage({
  payments,
}: {
  payments: unknown[];
}) {
  const { calendarSystem } = useCalendarSystem();
  return (
    <div className="space-y-4">
      {/* ── Header with Calendar Toggle ─────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fee Payments</h2>
        <CalendarToggle />
      </div>

      {payments.length === 0 ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          No payment records found yet.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Month/Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.payment_date
                      ? formatDateForUI(payment.payment_date, calendarSystem)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "confirmed" ? "default" : "secondary"
                      }
                      className={
                        payment.status === "confirmed"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>BIRR {payment.amount}</TableCell>
                  <TableCell>{payment.payment_method || "-"}</TableCell>
                  <TableCell>{payment.payment_type || "Tuition Fee"}</TableCell>
                  <TableCell className="font-medium">
                    {(() => {
                      // Try to format with Ethiopian calendar if valid data
                      if (payment.month && payment.year) {
                        const month = parseInt(payment.month);
                        const year = parseInt(payment.year);

                        // Validate month and year
                        if (
                          !isNaN(month) &&
                          !isNaN(year) &&
                          month >= 1 &&
                          month <= 12 &&
                          year > 1900 &&
                          year < 2100
                        ) {
                          try {
                            return formatDateForUI(
                              `${year}-${month.toString().padStart(2, "0")}-01`,
                              calendarSystem,
                            );
                          } catch (error) {
                            console.warn(
                              "Invalid date formatting for payment:",
                              { month, year, error },
                            );
                          }
                        }
                      }

                      // Fallback to original format
                      return `${payment.month || "Unknown"} ${payment.year || "Year"}`;
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
