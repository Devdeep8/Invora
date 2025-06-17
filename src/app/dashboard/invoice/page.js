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
import { requireUser } from "@/utils/requireUser";
import { getInvoices } from "@/app/action";

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
