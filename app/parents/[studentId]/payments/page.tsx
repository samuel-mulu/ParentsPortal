import { getPaymentsByStudentId } from "@/lib/students";
import ClientPaymentsPage from "./payments-client";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const payments = await getPaymentsByStudentId(studentId);

  return <ClientPaymentsPage payments={payments} />;
}
