'use client'

import { useEffect, useState, useMemo } from 'react'
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
import { createInvoice } from '@/app/action'
import { invoiceSchema } from '@/utils/zodSchema'
import { formatCurrency } from '@/utils/formatCurrency'

function generateInvoiceNumber() {
  // Generate a random six-digit number as a string. You can update the logic as needed.
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function CreateInvoice({ address, email, firstName, lastName }) {
  const [lastResult, action] = useActionState(createInvoice, undefined)
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

  // Automatically generate invoice number and invoice name on component mount.
  const [autoInvoiceNumber, setAutoInvoiceNumber] = useState('')
  const [autoInvoiceName, setAutoInvoiceName] = useState('')

  useEffect(() => {
    const number = generateInvoiceNumber()
    setAutoInvoiceNumber(number)
    setAutoInvoiceName(`Invoice #${number}`)
  }, [])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [rate, setRate] = useState('')
  const [quantity, setQuantity] = useState('')
  // Set default currency to INR
  const [currency, setCurrency] = useState('INR')

  // Fix: Use useMemo to ensure the calculation updates when rate or quantity changes
  const calculateTotal = useMemo(() => {
    const numQuantity = Number(quantity) || 0
    const numRate = Number(rate) || 0
    return numQuantity * numRate
  }, [quantity, rate])

  // Initialize form values from fields if they exist
  useEffect(() => {
    if (fields.invoiceItemQuantity.initialValue && !quantity) {
      setQuantity(fields.invoiceItemQuantity.initialValue)
    }
    if (fields.invoiceItemRate.initialValue && !rate) {
      setRate(fields.invoiceItemRate.initialValue)
    }
  }, [fields.invoiceItemQuantity.initialValue, fields.invoiceItemRate.initialValue, quantity, rate])

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardContent className='p-6'>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
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
          <input
            type='hidden'
            name={fields.invoiceItemQuantity.name}
            value={quantity}
          />
          <input
            type='hidden'
            name={fields.invoiceItemRate.name}
            value={rate}
          />

          <div className='flex flex-col gap-1 w-fit mb-6'>
            <div className='flex items-center gap-4'>
              <Badge variant='secondary'>Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                // Use the auto-generated invoice name as default.
                defaultValue={
                  autoInvoiceName || fields.invoiceName.initialValue
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
                  // Use the auto-generated invoice number as the default value.
                  defaultValue={
                    autoInvoiceNumber || fields.invoiceNumber.initialValue
                  }
                  className='rounded-l-none'
                  // Optionally, mark this as read-only if you do not wish the user to change it:
                  readOnly
                  placeholder='Auto Generated'
                />
              </div>
              <p className='text-red-500 text-sm'>
                {fields.invoiceNumber.errors}
              </p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                // Set default value to "INR"
                defaultValue='INR'
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
                  defaultValue={firstName + ' ' + lastName}
                />
                <p className='text-red-500 text-sm'>{fields.fromName.errors}</p>
                <Input
                  placeholder='Your Email'
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={email}
                />
                <p className='text-red-500 text-sm'>
                  {fields.fromEmail.errors}
                </p>
                <Input
                  placeholder='Your Address'
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={address}
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
                  defaultValue={fields.clientName.initialValue}
                  placeholder='Client Name'
                />
                <p className='text-red-500 text-sm'>
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder='Client Email'
                />
                <p className='text-red-500 text-sm'>
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
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
                defaultValue={fields.dueDate.initialValue}
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
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  placeholder='Item name & description'
                />
                <p className='text-red-500 text-sm'>
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className='col-span-2'>
                <Input
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
                  value={formatCurrency(
                  calculateTotal,
                   currency,
                  )}
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
                  {formatCurrency(
                     calculateTotal,
                     currency,
                  )}
                </span>
              </div>
              <div className='flex justify-between py-2 border-t'>
                <span>Total ({currency})</span>
                <span className='font-medium underline underline-offset-2'>
                  {formatCurrency(
                     calculateTotal,
                   currency,
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder='Add your Note/s right here...'
            />
            <p className='text-red-500 text-sm'>{fields.note.errors}</p>
          </div>

          <div className='flex items-center justify-end mt-6'>
            <div>
              <SubmitBtn text='Send Invoice to Client' />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}