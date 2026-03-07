"use client";

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

export default function ClientPaymentsPage({ payments }: { payments: any[] }) {
  const { calendarSystem } = useCalendarSystem();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fee Payments</h2>

      {payments.length === 0 ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          No payment records found yet.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month/Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.month} {payment.year}
                  </TableCell>
                  <TableCell>{payment.payment_type || "Tuition Fee"}</TableCell>
                  <TableCell>BIRR {payment.amount}</TableCell>
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
                  <TableCell>
                    {payment.payment_date
                      ? formatDateForUI(payment.payment_date, calendarSystem)
                      : "-"}
                  </TableCell>
                  <TableCell>{payment.payment_method || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
