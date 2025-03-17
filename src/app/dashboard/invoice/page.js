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


export default function InvoicePage() {
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
      <InvoiceTable/>
      </CardContent>
    </Card>
  );
}
