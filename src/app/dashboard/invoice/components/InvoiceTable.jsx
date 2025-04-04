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

export function InvoiceTable({ invoices }) {
  const router = useRouter()
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
            <TableCell>
              {invoice.id.slice(0, 8) + "..." + invoice.id.slice(-4)}
            </TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>₹{invoice.total.toFixed(2)}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{new Date(invoice.date).toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => 
                    router.push(`/api/invoice/${invoice.id}`)
                   }>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Mark as Paid ${invoice.id}`)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Mark as Paid</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(`Send Reminder for ${invoice.id}`)}>
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
  );
}
