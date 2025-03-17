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
import { MoreHorizontal } from "lucide-react";

export function InvoiceTable() {
  // Sample invoice data, amounts in INR.
  const invoices = [
    {
      id: "INV-001",
      customer: "John Doe",
      amount: 100.0,
      status: "Paid",
      date: "2023-09-01",
    },
    {
      id: "INV-002",
      customer: "Jane Smith",
      amount: 200.0,
      status: "Pending",
      date: "2023-09-02",
    },
  ];

  return (
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
          <TableRow key={invoice.id}>
            <TableCell>{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              ₹{invoice.amount.toFixed(2)}
            </TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => console.log(`View ${invoice.id}`)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Mark as Paid ${invoice.id}`)}>
                    Mark as Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Send Reminder for ${invoice.id}`)}>
                    Reminder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Update ${invoice.id}`)}>
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Delete ${invoice.id}`)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
