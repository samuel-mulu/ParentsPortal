import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getPaymentsByStudentId } from "@/lib/students";

// Type definitions
interface Payment {
  id: string;
  amount: number;
  month: number;
  year: number;
  status: string;
  payment_date?: string;
  payment_method?: string;
  payment_type?: string;
}

interface PaymentsByYear {
  [year: string]: Payment[];
}

// Helper function to get month name from number
function getMonthName(monthNumber: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1] || "Unknown";
}

// Helper function to generate all months for a year
function generateAllMonthsForYear(
  year: number,
): Array<{ month: number; monthName: string; year: number }> {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: getMonthName(i + 1),
    year,
  }));
}

// Helper function to get status variant
function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    default:
      return "outline";
  }
}

// Helper function to get status color class
function getStatusColorClass(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    default:
      return "bg-gray-500 hover:bg-gray-600 text-white";
  }
}

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const payments = (await getPaymentsByStudentId(studentId)) as Payment[];

  // Get current year
  const currentYear = new Date().getFullYear();

  // Group payments by year
  const paymentsByYear = payments.reduce(
    (acc: PaymentsByYear, payment: Payment) => {
      const year = payment.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(payment);
      return acc;
    },
    {} as PaymentsByYear,
  );

  // Get all years from payments, include current year even if no payments
  const allYears = Object.keys(paymentsByYear)
    .map(Number)
    .sort((a, b) => b - a);
  if (!allYears.includes(currentYear)) {
    allYears.push(currentYear);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Fee Payments</h2>
        <p className="text-sm text-muted-foreground">
          View payment status for all months. Currency: Ethiopian Birr (BIRR)
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
          <div className="text-4xl mb-3">💳</div>
          <p className="font-medium">No payment records found yet.</p>
          <p className="text-sm mt-1">
            Payment records will appear here once they are added.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {allYears.map((year) => {
            const yearPayments = paymentsByYear[year] || [];
            const allMonths = generateAllMonthsForYear(year);

            return (
              <Card key={year} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg">{year} Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Amount (BIRR)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allMonths.map((monthInfo) => {
                        // Find payment for this month
                        const payment = yearPayments.find(
                          (p: Payment) => p.month === monthInfo.month,
                        );

                        return (
                          <TableRow key={`${year}-${monthInfo.month}`}>
                            <TableCell className="font-medium">
                              {monthInfo.monthName} {year}
                            </TableCell>
                            <TableCell>
                              {payment?.payment_type || "Tuition Fee"}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {payment
                                ? `${payment.amount.toLocaleString()} BIRR`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {payment ? (
                                <Badge
                                  variant={getStatusVariant(payment.status)}
                                  className={getStatusColorClass(
                                    payment.status,
                                  )}
                                >
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  No Payment
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {payment?.payment_date
                                ? new Date(
                                    payment.payment_date,
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {payment?.payment_method || "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
