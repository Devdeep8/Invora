import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request, { params }) {
  const { invoiceId } = await params;

  // 1. Fetch invoice data from Prisma with only the specified fields
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
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
  });

  if (!data) {
    return new NextResponse(
      JSON.stringify({ error: "Invoice not found" }),
      { status: 404 }
    );
  }

  // 2. Format dates properly
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // 3. Set professional blue color for brand elements
  const brandColor = [41, 128, 185]; // Professional blue

  // 4. Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set base styling
  pdf.setFont("helvetica", "normal");
  let yPos = 20;
  const leftMargin = 15;
  const rightMargin = 195;
  const pageWidth = rightMargin - leftMargin;

  // 5. HEADER - Company name with styling
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.text(data.fromName || "Professional Invoice", leftMargin, yPos);
  yPos += 10;

  // 6. Add a stylish header bar
  pdf.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.rect(leftMargin, yPos, pageWidth, 8, 'F');
  yPos += 14;

  // 7. INVOICE HEADING
  pdf.setTextColor(0, 0, 0); // Reset to black text
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("INVOICE", leftMargin, yPos);
  
  // Invoice info on right side
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Invoice Number:`, 140, yPos - 3);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${data.invoiceNumber}`, 180, yPos - 3);
  
  pdf.setFont("helvetica", "normal");
  pdf.text(`Issue Date:`, 140, yPos);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${formatDate(data.date)}`, 180, yPos);
  

  
  yPos += 14;

  // 8. FROM (Seller) & TO (Client) side-by-side with cleaner formatting
  let fromY = yPos;
  let toY = yPos;
  const rightColumnX = 105;

  // Seller Info
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.text("FROM:", leftMargin, fromY);
  fromY += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(data.fromName || "", leftMargin, fromY);
  fromY += 5;
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  
  // Handle multi-line addresses with proper wrapping
  if (data.fromAddress) {
    const addressLines = pdf.splitTextToSize(data.fromAddress, 80);
    pdf.text(addressLines, leftMargin, fromY);
    fromY += addressLines.length * 4;
  }
  
  if (data.fromEmail) {
    pdf.text(`Email: ${data.fromEmail}`, leftMargin, fromY);
    fromY += 4;
  }

  // Client Info
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.text("BILL TO:", rightColumnX, toY);
  toY += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(data.clientName || "", rightColumnX, toY);
  toY += 5;
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  
  if (data.clientAddress) {
    const clientAddressLines = pdf.splitTextToSize(data.clientAddress, 80);
    pdf.text(clientAddressLines, rightColumnX, toY);
    toY += clientAddressLines.length * 4;
  }
  
  if (data.clientEmail) {
    pdf.text(`Email: ${data.clientEmail}`, rightColumnX, toY);
    toY += 4;
  }

  // Update yPos to whichever column is lower
  yPos = Math.max(fromY, toY) + 10;

  // 9. TABLE OF ITEMS USING jspdf-autotable with improved styling
  // Calculate item amount
  const itemAmount = (Number(data.invoiceItemRate) || 0) * (Number(data.invoiceItemQuantity) || 0);
  
  // Prepare table row
  const rows = [
    [
      data.invoiceItemDescription || "",
      data.invoiceItemQuantity || "",
      `${data.currency || "₹"} ${(Number(data.invoiceItemRate) || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
      `${data.currency || "₹"} ${itemAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
    ],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [["Description", "Quantity", "Rate", "Amount"]],
    body: rows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: [80, 80, 80],
      valign: "middle"
    },
    headStyles: {
      fillColor: brandColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineWidth: 0,
      halign: "left"
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Get current position after the table
  let finalY = pdf.lastAutoTable.finalY + 5;

  // 10. TOTAL SECTION
  const summaryX = 125;
  const valueX = 175;
  
  // Add a line before total
  pdf.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(summaryX, finalY, valueX + 20, finalY);
  finalY += 4;
  
  // Total with emphasis
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.text("TOTAL:", summaryX, finalY);
  pdf.text(`${data.currency || "₹"} ${(Number(data.total) || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, valueX, finalY);
  finalY += 12;
  
  pdf.setTextColor(0, 0, 0); // Reset to black

  // 11. NOTE SECTION (if any)
  if (data.note) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Notes:", leftMargin, finalY);
    finalY += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const noteLines = pdf.splitTextToSize(data.note, 180);
    pdf.text(noteLines, leftMargin, finalY);
    finalY += noteLines.length * 4 + 6;
  }

  // 12. FOOTER
  pdf.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, 280, rightMargin, 280);
  
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("Thank you for your business!", leftMargin, 285);
  
  // Add page numbers if multiple pages
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.text(`Page ${i} of ${totalPages}`, rightMargin, 290, { align: 'right' });
  }

  // 13. Return PDF buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Invoice-${data.invoiceNumber}.pdf"`,
    },
  });
}