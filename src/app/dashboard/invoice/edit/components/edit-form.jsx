'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Add this import
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import { useActionState } from 'react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import SubmitBtn from '@/hooks/submitBtn'
import { editInvoice } from '@/app/action'
import { invoiceSchema } from '@/utils/zodSchema'
import { formatCurrency } from '@/utils/formatCurrency'

export function EditInvoice({ invoice, address, email, firstName, lastName }) {
  const router = useRouter() // Add router hook
  const [lastResult, action] = useActionState(editInvoice, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  })

  useEffect(() => {
    if (lastResult?.success) {
      router.push('/dashboard/invoice')
    }
  }, [lastResult, router])

  // Initialize state with existing invoice data
  const [selectedDate, setSelectedDate] = useState(new Date(invoice.date))
  const [rate, setRate] = useState(invoice.invoiceItemRate?.toString() || '')
  const [quantity, setQuantity] = useState(
    invoice.invoiceItemQuantity?.toString() || ''
  )
  const [currency, setCurrency] = useState(invoice.currency || 'INR')

  const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0)

  // Add useEffect to handle successful edit
  // useEffect(() => {
  //   if (lastResult.success) {
  //     // Redirect to dashboard/invoice after successful edit
  //     router.push("/dashboard/invoice");
  //   }
  // }, [lastResult, router]);

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardContent className='p-6'>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          {/* Hidden field for invoice ID */}
          <input type='hidden' name='invoiceId' value={invoice.id} />
          <input
            type='hidden'
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />
          <input
            type='hidden'
            name={fields.total.name}
            value={calculateTotal}
          />

          <div className='flex flex-col gap-1 w-fit mb-6'>
            <div className='flex items-center gap-4'>
              <Badge
                variant={invoice.status === 'PAID' ? 'success' : 'secondary'}
              >
                {invoice.status}
              </Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={
                  invoice.invoiceName || fields.invoiceName.initialValue
                }
                placeholder='Invoice Name'
              />
            </div>
            <p className='text-sm text-red-500'>{fields.invoiceName.errors}</p>
          </div>

          <div className='grid md:grid-cols-3 gap-6 mb-6'>
            <div>
              <Label>Invoice No.</Label>
              <div className='flex'>
                <span className='px-3 border border-r-0 rounded-l-md bg-muted flex items-center'>
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={
                    invoice.invoiceNumber || fields.invoiceNumber.initialValue
                  }
                  className='rounded-l-none'
                  readOnly
                  placeholder='Invoice Number'
                />
              </div>
              <p className='text-red-500 text-sm'>
                {fields.invoiceNumber.errors}
              </p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                defaultValue={invoice.currency || 'INR'}
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={value => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Currency' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='INR'>Indian Rupee -- INR</SelectItem>
                  <SelectItem value='USD'>
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value='EUR'>Euro -- EUR</SelectItem>
                  <SelectItem value='GBP'>
                    British Pound Sterling -- GBP
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className='text-red-500 text-sm'>{fields.currency.errors}</p>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <Label>From</Label>
              <div className='space-y-2'>
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  placeholder='Your Name'
                  defaultValue={invoice.fromName || firstName + ' ' + lastName}
                />
                <p className='text-red-500 text-sm'>{fields.fromName.errors}</p>
                <Input
                  placeholder='Your Email'
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={invoice.fromEmail || email}
                />
                <p className='text-red-500 text-sm'>
                  {fields.fromEmail.errors}
                </p>
                <Input
                  placeholder='Your Address'
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={invoice.fromAddress || address}
                />
                <p className='text-red-500 text-sm'>
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>

            <div>
              <Label>To</Label>
              <div className='space-y-2'>
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={
                    invoice.clientName || fields.clientName.initialValue
                  }
                  placeholder='Client Name'
                />
                <p className='text-red-500 text-sm'>
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={
                    invoice.clientEmail || fields.clientEmail.initialValue
                  }
                  placeholder='Client Email'
                />
                <p className='text-red-500 text-sm'>
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={
                    invoice.clientAddress || fields.clientAddress.initialValue
                  }
                  placeholder='Client Address'
                />
                <p className='text-red-500 text-sm'>
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-[280px] text-left justify-start'
                  >
                    <CalendarIcon />
                    {selectedDate ? (
                      new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'long',
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    selected={selectedDate}
                    onSelect={date => setSelectedDate(date || new Date())}
                    mode='single'
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className='text-red-500 text-sm'>{fields.date.errors}</p>
            </div>

            <div>
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={
                  invoice.dueDate?.toString() || fields.dueDate.initialValue
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select due date' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>Due on Receipt</SelectItem>
                  <SelectItem value='15'>Net 15</SelectItem>
                  <SelectItem value='30'>Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className='text-red-500 text-sm'>{fields.dueDate.errors}</p>
            </div>
          </div>

          <div>
            <div className='grid grid-cols-12 gap-4 mb-2 font-medium'>
              <p className='col-span-6'>Description</p>
              <p className='col-span-2'>Quantity</p>
              <p className='col-span-2'>Rate</p>
              <p className='col-span-2'>Amount</p>
            </div>

            <div className='grid grid-cols-12 gap-4 mb-4'>
              <div className='col-span-6'>
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={
                    invoice.invoiceItemDescription ||
                    fields.invoiceItemDescription.initialValue
                  }
                  placeholder='Item name & description'
                />
                <p className='text-red-500 text-sm'>
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className='col-span-2'>
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  type='number'
                  placeholder='0'
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />
                <p className='text-red-500 text-sm'>
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className='col-span-2'>
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  type='number'
                  placeholder='0'
                />
                <p className='text-red-500 text-sm'>
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className='col-span-2'>
                <Input
                  value={formatCurrency({
                    amount: calculateTotal,
                    currency: currency,
                  })}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <div className='w-1/3'>
              <div className='flex justify-between py-2'>
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency,
                  })}
                </span>
              </div>
              <div className='flex justify-between py-2 border-t'>
                <span>Total ({currency})</span>
                <span className='font-medium underline underline-offset-2'>
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={invoice.note || fields.note.initialValue}
              placeholder='Add your Note/s right here...'
            />
            <p className='text-red-500 text-sm'>{fields.note.errors}</p>
          </div>

          <div className='flex items-center justify-end mt-6 gap-4'>
            <Button
              variant='outline'
              type='button'
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <SubmitBtn text='Update Invoice' />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
