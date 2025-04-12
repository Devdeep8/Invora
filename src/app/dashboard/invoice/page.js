import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { InvoiceTable } from "./components/InvoiceTable";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/requireUser";

const getInvoices = async (userId) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      clientName: true,
      total: true,
      status: true,
      date: true,
      dueDate: true,
    },
  });

  // Compute the amount by multiplying rate and quantity
 

  return invoices;
};

export default async function  InvoicePage() {
  const session = await requireUser();
  const invoices = await getInvoices(session?.user?.id);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold"> Invoice</CardTitle>
            <CardDescription>View and manage your invoices</CardDescription>
          </div>
          <Link
            href="/dashboard/invoice/create"
            className={buttonVariants({
              variant: "default",
            })}
          >
            
            <PlusIcon />
            Create Invoice
          </Link>
        </div>
      </CardHeader>
      <CardContent>
      <InvoiceTable invoices={invoices} />
      </CardContent>
    </Card>
  );
}
