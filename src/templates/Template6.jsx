import React from 'react'
import { format } from 'date-fns'
import BaseTemplate from './BaseTemplate'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

const Template6 = ({ data, invoiceId }) => {
  const {
    billTo = {},
    shipTo = {},
    invoice = {},
    yourCompany = {},
    items = [],
    taxPercentage = 0,
    taxAmount = 0,
    subTotal = 0,
    grandTotal = 0,
    notes = '',
  } = data || {}

  const handleDownloadPDF = () => {
    if (invoiceId) {
      window.open(`/api/invoice/${invoiceId}`, '_blank')
    }
  }

  return (
    <BaseTemplate data={data}>
      <div className='bg-white p-8 max-w-4xl mx-auto'>
        {invoiceId && (
          <div className='flex justify-end mb-4'>
            <Button
              onClick={handleDownloadPDF}
              variant='outline'
              className='flex items-center gap-2'
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        )}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h2 className='text-2xl font-bold' style={{ color: '#14A8DE' }}>
              {yourCompany.name || 'Company Name'}
            </h2>
            <p>{yourCompany.address || 'Company Address'}</p>
            {yourCompany.email && <p>{yourCompany.email}</p>}
          </div>
          <div className='text-right'>
            <h1 className='text-3xl font-thin mb-4'>Tax Invoice</h1>
            <p>
              <span className='font-semibold'>Invoice No:</span>{' '}
              {invoice.number || 'N/A'}
            </p>
            <p>
              <span className='font-semibold'>Invoice Date:</span>{' '}
              {invoice.date
                ? format(new Date(invoice.date), 'MMM dd, yyyy')
                : 'N/A'}
            </p>
            <p>
              <span className='font-semibold'>Due Date:</span>{' '}
              {invoice.paymentDate
                ? format(new Date(invoice.paymentDate), 'MMM dd, yyyy')
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-8 mb-8'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Billed to</h3>
            <p>{billTo.name || 'Client Name'}</p>
            <p>{billTo.address || 'Client Address'}</p>
            {billTo.email && <p>{billTo.email}</p>}
          </div>
        </div>

        <table className='w-full mb-8 border border-gray-300'>
          <thead style={{ backgroundColor: '#14A8DE' }}>
            <tr>
              <th className='p-2 text-left border-b border-gray-300 text-white'>
                Item description
              </th>
              <th className='p-2 text-right border-b border-gray-300 text-white'>
                Quantity
              </th>
              <th className='p-2 text-right border-b border-gray-300 text-white'>
                Rate
              </th>
              <th className='p-2 text-right border-b border-gray-300 text-white'>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className='p-2 border border-gray-300'>
                  <p className='font-semibold'>{item.name || 'Item Name'}</p>
                  <p className='text-sm text-gray-600'>
                    {item.description || 'Item Description'}
                  </p>
                </td>
                <td className='p-2 text-right border border-gray-300'>
                  {item.quantity || 0}
                </td>
                <td className='p-2 text-right border border-gray-300'>
                  {formatCurrency(item.amount || 0, data.currency || 'INR')}
                </td>
                <td className='p-2 text-right border border-gray-300'>
                  {formatCurrency(
                    (item.amount || 0) * (item.quantity || 0),
                    data.currency || 'INR'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-end'>
          <table className='w-1/2 mb-8 border border-gray-300'>
            <tbody>
              <tr>
                <td className='p-2 text-right font-semibold border border-gray-300'>
                  Sub Total
                </td>
                <td className='p-2 text-right border border-gray-300'>
                  {formatCurrency(subTotal, data.currency || 'INR')}
                </td>
              </tr>
              {taxPercentage > 0 && (
                <tr>
                  <td className='p-2 text-right font-semibold border border-gray-300'>
                    Tax ({taxPercentage}%)
                  </td>
                  <td className='p-2 text-right border border-gray-300'>
                    {formatCurrency(taxAmount, data.currency || 'INR')}
                  </td>
                </tr>
              )}
              <tr className='text-white' style={{ backgroundColor: '#14A8DE' }}>
                <td className='p-2 text-right font-semibold border border-gray-300'>
                  Total Due Amount
                </td>
                <td className='p-2 text-right border border-gray-300'>
                  {formatCurrency(grandTotal, data.currency || 'INR')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='text-center text-sm border-t pt-4'>
          <p>{notes}</p>
        </div>
      </div>
    </BaseTemplate>
  )
}

export default Template6
