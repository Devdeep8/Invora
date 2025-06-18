'use client'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  Bell,
  Edit,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DeleteInvoice,
  MarkAsPaidAction,
  ReminderOfInvoice,
} from '@/app/action'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'

const formatDate = date => {
  if (!date) return 'Invalid Date'
  const parsed = new Date(date)
  return isNaN(parsed.getTime())
    ? 'Invalid Date'
    : parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
}

export function InvoiceTable({ invoices }) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState(null)

  const handleReminder = async invoice => {
    const invoiceId = invoice.id
    if (!invoiceId) return

    const issueDate = new Date(invoice.date)
    const dueDays = parseInt(invoice.dueDate, 10)
    const dueDate = new Date(issueDate)
    dueDate.setDate(issueDate.getDate() + dueDays)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    if (today >= dueDate) {
      await ReminderOfInvoice(invoiceId)
      toast.success('Reminder sent successfully.')
    } else {
      toast.info('Invoice is not yet due.')
    }
  }

  const handlePaid = async invoice => {
    const invoiceId = invoice.id
    if (!invoiceId) return
    if (invoice.status === 'PAID') {
      toast.info('Invoice is already paid.')
      return
    }

    try {
      await MarkAsPaidAction(invoiceId)
      toast.success('Invoice marked as paid.')
      router.refresh()
    } catch (err) {
      console.error('Error marking invoice as paid:', err)
      toast.error('Failed to mark invoice as paid.')
    }
  }

  const handleDelete = async () => {
    if (!invoiceToDelete?.id) return

    try {
      await DeleteInvoice(invoiceToDelete.id)
      toast.success('Invoice deleted.')
      setDialogOpen(false)
      setInvoiceToDelete(null)
      router.refresh()
    } catch (err) {
      console.error('Error deleting invoice:', err)
      toast.error('Failed to delete invoice.')
    }
  }

  const handleUpdate = invoice => {
    router.push(`/dashboard/invoice/edit/${invoice.id}`)
  }

  if (invoices.length === 0) {
    return (
      <div className='text-center text-muted-foreground py-8'>
        No invoices found.
      </div>
    )
  }

  return (
    <>
      <div className='overflow-x-auto'>
        <Table className='min-w-full'>
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
            {invoices.map(invoice => (
              <TableRow key={invoice.id ?? Math.random()}>
                <TableCell>
                  {invoice.id
                    ? `${invoice.id.slice(0, 8)}...${invoice.id.slice(-4)}`
                    : '❌ Missing ID'}
                </TableCell>
                <TableCell>
                  {invoice.clientName ?? invoice.customerName}
                </TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === 'PAID' ? 'success' : 'destructive'
                    }
                    data-testid={`status-${invoice.status.toLowerCase()}`}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='p-1'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/api/invoice/${invoice.id}`)
                        }
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePaid(invoice)}>
                        <CheckCircle className='mr-2 h-4 w-4' />
                        <span>Mark as Paid</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReminder(invoice)}>
                        <Bell className='mr-2 h-4 w-4' />
                        <span>Reminder</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdate(invoice)}>
                        <Edit className='mr-2 h-4 w-4' />
                        <span>Update</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setInvoiceToDelete(invoice)
                          setDialogOpen(true)
                        }}
                      >
                        <Trash className='mr-2 h-4 w-4 text-red-500' />
                        <span className='text-red-500'>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <p className='text-sm text-muted-foreground'>
              This action cannot be undone. This will permanently delete the
              invoice{' '}
              <strong>
                {invoiceToDelete?.id?.slice(0, 6)}...
                {invoiceToDelete?.id?.slice(-4)}
              </strong>
              .
            </p>
          </DialogHeader>
          <DialogFooter className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
