import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

// Helper function to format currency for PDF
const formatCurrency = (amount, currency = 'INR') => {
  // Format the number with commas for thousands separator
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  // Add the appropriate currency symbol
  switch (currency) {
    case 'INR':
      // Use "Rs." instead of the Unicode rupee symbol for better compatibility
      return `Rs. ${formattedNumber}`
    case 'USD':
      return `$ ${formattedNumber}`
    case 'EUR':
      return `€ ${formattedNumber}`
    case 'GBP':
      return `£ ${formattedNumber}`
    default:
      return `${currency} ${formattedNumber}`
  }
}

export async function GET(request, { params }) {
  const { invoiceId } = await params

  // Retrieve only the selected invoice fields.
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      note: true,
    },
  })

  if (!data) {
    return new NextResponse(JSON.stringify({ error: 'Invoice not found' }), {
      status: 404,
    })
  }

  const createdDate = data.date ? new Date(data.date) : new Date()
  const dueDate2 = data.dueDate
    ? new Date(
        new Date(createdDate).setDate(
          createdDate.getDate() + parseInt(data.dueDate)
        )
      )
    : new Date()

  // Format the data for Template6
  const templateData = {
    yourCompany: {
      name: data.fromName || 'Your Company',
      address: data.fromAddress || '',
      phone: data.fromEmail || '', // Using email as contact info
      email: data.fromEmail || '', // Add email explicitly
    },
    billTo: {
      name: data.clientName || '',
      address: data.clientAddress || '',
      email: data.clientEmail || '',
    },
    invoice: {
      number: data.invoiceNumber || '',
      date: createdDate,
      paymentDate: dueDate2,
    },
    items: [
      {
        name: data.invoiceItemDescription || '',
        description: '',
        quantity: Number(data.invoiceItemQuantity) || 0,
        amount: Number(data.invoiceItemRate) || 0,
      },
    ],
    subTotal: Number(data.total) || 0,
    taxPercentage: 0, // No tax in the original data
    taxAmount: 0,
    grandTotal: Number(data.total) || 0,
    notes: data.note || '',
    currency: data.currency || 'INR', // Add currency to the template data
  }

  // Create a new PDF document (A4, portrait) that matches Template6 style
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Add Noto Sans font which has better Unicode support including the rupee symbol
  // Note: In a production environment, you might want to include the actual font file
  pdf.setFont('helvetica')

  // Define common layout values
  const leftMargin = 20
  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPosition = 20

  // -----------------------------
  // Header Section: Company Info and Invoice Details
  // -----------------------------
  // Company name with blue color (#14A8DE) - matches Template6 style
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(18)
  pdf.setTextColor(20, 168, 222) // #14A8DE in RGB
  // Ensure company name is a string
  const companyName = String(templateData.yourCompany.name || '')
  pdf.text(companyName, leftMargin, yPosition)
  pdf.setTextColor(0, 0, 0) // Reset to black
  yPosition += 8

  // Company details
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  if (templateData.yourCompany.address) {
    const addressLines = pdf.splitTextToSize(
      String(templateData.yourCompany.address),
      pageWidth / 3
    )
    pdf.text(addressLines, leftMargin, yPosition)
    yPosition += addressLines.length * 5
  }

  // if (templateData.yourCompany.phone) {
  //   pdf.text(String(templateData.yourCompany.phone), leftMargin, yPosition);
  //   yPosition += 5;
  // }

  if (templateData.yourCompany.email) {
    pdf.text(String(templateData.yourCompany.email), leftMargin, yPosition)
    yPosition += 5
  }

  // Invoice title and metadata on the right - matches Template6 style
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(24)
  pdf.text('Tax Invoice', pageWidth - leftMargin, 25, { align: 'right' })

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Invoice No:', pageWidth - leftMargin - 50, 35)
  pdf.setFont('helvetica', 'normal')
  // Ensure invoice number is a string
  const invoiceNumber = String(templateData.invoice.number || '')
  pdf.text(invoiceNumber, pageWidth - leftMargin, 35, { align: 'right' })

  pdf.setFont('helvetica', 'bold')
  pdf.text('Invoice Date:', pageWidth - leftMargin - 50, 40)
  pdf.setFont('helvetica', 'normal')
  const formattedDate = templateData.invoice.date
    ? format(new Date(templateData.invoice.date), 'MMM dd, yyyy')
    : 'N/A'
  pdf.text(formattedDate, pageWidth - leftMargin, 40, { align: 'right' })

  pdf.setFont('helvetica', 'bold')
  pdf.text('Due Date:', pageWidth - leftMargin - 50, 45)
  pdf.setFont('helvetica', 'normal')
  const dueDate = templateData.invoice.paymentDate
    ? format(new Date(templateData.invoice.paymentDate), 'MMM dd, yyyy')
    : 'N/A'
  pdf.text(dueDate, pageWidth - leftMargin, 45, { align: 'right' })

  // Reset yPosition to the highest point after both columns
  yPosition = Math.max(yPosition, 55)

  // -----------------------------
  // Billed To Section - matches Template6 style
  // -----------------------------
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Billed to', leftMargin, yPosition)
  yPosition += 6

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  // Ensure client name is a string
  const clientName = String(templateData.billTo.name || 'Client Name')
  pdf.text(clientName, leftMargin, yPosition)
  yPosition += 5

  if (templateData.billTo.address) {
    const addressLines = pdf.splitTextToSize(
      String(templateData.billTo.address),
      pageWidth / 2 - leftMargin
    )
    pdf.text(addressLines, leftMargin, yPosition)
    yPosition += addressLines.length * 5
  }

  if (templateData.billTo.email) {
    pdf.text(String(templateData.billTo.email), leftMargin, yPosition)
    yPosition += 5
  }

  yPosition += 10

  // -----------------------------
  // Invoice Items Table Section - matches Template6 style
  // -----------------------------
  // Build table rows from the items array
  const tableRows = templateData.items.map(item => [
    {
      content: String(item.name || ''),
      styles: { fontStyle: 'bold' },
    },
    String(item.quantity || 0),
    formatCurrency(Number(item.amount || 0), templateData.currency || 'INR'),
    formatCurrency(
      Number(item.amount || 0) * Number(item.quantity || 0),
      templateData.currency || 'INR'
    ),
  ])

  // Generate the table using autoTable with blue header (#14A8DE) - matches Template6 style
  autoTable(pdf, {
    startY: yPosition,
    head: [[' Description', 'Quantity', 'Rate', 'Amount']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [20, 168, 222], // #14A8DE in RGB
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  })

  let finalY = pdf.lastAutoTable.finalY + 10

  // -----------------------------
  // Total Amount Section with blue background for total - matches Template6 style
  // -----------------------------
  // Create a table for the totals section aligned to the right
  const totalsTableWidth = 115 // Width of the totals table

  autoTable(pdf, {
    startY: finalY,
    margin: { left: pageWidth - totalsTableWidth - leftMargin },
    body: [
      [
        'Sub Total',
        formatCurrency(
          Number(templateData.subTotal || 0),
          templateData.currency || 'INR'
        ),
      ],
      ...(Number(templateData.taxPercentage || 0) > 0
        ? [
            [
              `Tax (${Number(templateData.taxPercentage || 0)}%)`,
              formatCurrency(
                Number(templateData.taxAmount || 0),
                templateData.currency || 'INR'
              ),
            ],
          ]
        : []),
      [
        'Total Due Amount',
        formatCurrency(
          Number(templateData.grandTotal || 0),
          templateData.currency || 'INR'
        ),
      ],
    ],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold', halign: 'right' },
      1: { cellWidth: 35, halign: 'right' },
    },
    didDrawCell: function (data) {
      // Color the total row with blue background - matches Template6 style
      if (
        data.row.index === (Number(templateData.taxPercentage || 0) > 0 ? 2 : 1)
      ) {
        pdf.setFillColor(20, 168, 222) // #14A8DE
        pdf.setTextColor(255, 255, 255) // White text
        pdf.rect(
          data.cell.x,
          data.cell.y,
          data.cell.width,
          data.cell.height,
          'F'
        )
        // Ensure cell text is a string
        const cellText = String(data.cell.text || '')
        pdf.text(
          cellText,
          data.cell.x + data.cell.width - 2,
          data.cell.y + data.cell.height / 2,
          {
            align: 'right',
            baseline: 'middle',
          }
        )
      }
    },
  })

  finalY = pdf.lastAutoTable.finalY + 15

  // -----------------------------
  // Notes Section - matches Template6 style
  // -----------------------------
  if (templateData.notes) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0) // Reset to black
    // Ensure notes are a string
    const notesText = String(templateData.notes)
    const noteLines = pdf.splitTextToSize(notesText, pageWidth - leftMargin * 2)
    pdf.text(noteLines, pageWidth / 2, finalY, { align: 'center' })
    finalY += noteLines.length * 4 + 10
  }

  // -----------------------------
  // Footer Section
  // -----------------------------
  const footerY = 280
  pdf.setLineWidth(0.5)
  pdf.line(leftMargin, footerY, pageWidth - leftMargin, footerY)
  pdf.setFontSize(9)
  pdf.text('Thank you for your business!', pageWidth / 2, footerY + 6, {
    align: 'center',
  })

  // Add page numbers
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(9)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - leftMargin, 290, {
      align: 'right',
    })
  }

  // Convert the PDF to a buffer and return it with appropriate headers
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

  // Return the PDF with headers for both viewing and downloading
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Invoice-${data.invoiceNumber}.pdf"`,
    },
  })
}
