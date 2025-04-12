"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, Bell, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { MarkAsPaidAction, ReminderOfInvoice } from "@/app/action";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function InvoiceTable({ invoices }) {
  const router = useRouter();

  const handleReminder = async (invoice) => {
    const invoiceId = invoice.id;
    if (!invoiceId) {
      console.error("Invoice ID is undefined");
      return;
    }
  
    // Validate and parse the issue date
    const issueDate = new Date(invoice.date);
    console.log(issueDate , "issue date")

    if (isNaN(issueDate.getTime())) {
      console.error("Invalid issue date:", invoice.date);
      return;
    }
  
    // Validate and parse dueDays
    const dueDays = parseInt(invoice.dueDate, 10);
    if (isNaN(dueDays)) {
      console.error("Invalid dueDays:", invoice.dueDate);
      return;
    }

    console.log(dueDays , "due days")
  
    // Calculate the due date
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + dueDays);

    console.log(dueDate , "due date");
    
  
    // Normalize dates to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
  
    console.log(today , "today");
    // Check if the invoice is due or overdue
    if (today >= dueDate) {
      await ReminderOfInvoice(invoiceId);
    }
  };
  
  const handlePaid = async (invoice) => {
    const invoiceId = invoice.id;

    if (!invoiceId) {
      console.error("Invoice ID is undefined");
      return;
    }
    console.log(invoice , "invoice")
    console.log(invoice.status , "invoices status")

    if (invoice.status === "PAID") {
      toast.info("Invoice is already paid.");
      return;
    }


    console.log("Marking invoice with ID:", invoiceId);
    try {
      if (!invoiceId) {
        console.error("Invoice ID is undefined");
        return;
      }

      const result = await MarkAsPaidAction(invoiceId);
      console.log("Invoice marked as paid:", result);
      router.refresh()

      // Optional: Refresh the UI if data comes from server components
      // router.refresh();
    } catch (err) {
      console.error("Error marking invoice as paid:", err);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Amount (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id ?? Math.random()}>
              <TableCell>
                {invoice.id
                  ? `${invoice.id.slice(0, 8)}...${invoice.id.slice(-4)}`
                  : "❌ Missing ID"}
              </TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>₹{invoice.total.toFixed(2)}</TableCell>
              <TableCell><Badge variant={invoice.status === 'PAID' ? 'sucess' : 'destructive'}>{invoice.status}</Badge></TableCell>
              <TableCell>{new Date(invoice.date).toLocaleString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/api/invoice/${invoice.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePaid(invoice)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Mark as Paid</span>
                    </DropdownMenuItem> 
                    <DropdownMenuItem onClick={() => handleReminder(invoice)}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Reminder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log(`Update ${invoice.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Update</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log(`Delete ${invoice.id}`)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
