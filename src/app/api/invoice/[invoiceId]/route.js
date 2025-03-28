import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(request, { params }) {
  const { invoiceId } = params;

  // 1. Fetch invoice data from Prisma
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

  // 2. Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set base styling
  pdf.setFont("helvetica", "normal");
  let yPos = 15;
  const leftMargin = 15;

  // 3. HEADER SECTION (English)
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Patidar Stone Crusher", leftMargin, yPos);
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Manufacturers & Suppliers of All Types of Gitti", leftMargin, yPos);
  yPos += 10;

  // Draw a line below the header
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, yPos, 195, yPos);
  yPos += 8;

  // 4. INVOICE INFO
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(`Invoice: ${data.invoiceName}`, leftMargin, yPos);
  yPos += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`Invoice # ${data.invoiceNumber}`, leftMargin, yPos);
  yPos += 5;
  pdf.text(`Date: ${data.date || ""}`, leftMargin, yPos);
  yPos += 5;
  pdf.text(`Due Date: ${data.dueDate || ""}`, leftMargin, yPos);
  yPos += 10;

  // 5. FROM (Seller) & TO (Client) side-by-side
  let fromY = yPos;
  let toY = yPos;
  const rightColumnX = 105;

  // Seller Info
  pdf.setFont("helvetica", "bold");
  pdf.text("From:", leftMargin, fromY);
  fromY += 5;
  pdf.setFont("helvetica", "normal");
  pdf.text(data.fromName || "", leftMargin, fromY);
  fromY += 5;
  pdf.text(`Email: ${data.fromEmail || ""}`, leftMargin, fromY);
  fromY += 5;
  pdf.text(`Address: ${data.fromAddress || ""}`, leftMargin, fromY);

  // Client Info
  pdf.setFont("helvetica", "bold");
  pdf.text("To:", rightColumnX, toY);
  toY += 5;
  pdf.setFont("helvetica", "normal");
  pdf.text(data.clientName || "", rightColumnX, toY);
  toY += 5;
  pdf.text(`Email: ${data.clientEmail || ""}`, rightColumnX, toY);
  toY += 5;
  pdf.text(`Address: ${data.clientAddress || ""}`, rightColumnX, toY);

  // Update yPos to whichever column is lower
  yPos = Math.max(fromY, toY) + 10;
  pdf.line(leftMargin, yPos, 195, yPos);
  yPos += 5;

  // 6. TABLE OF ITEMS USING jspdf-autotable
  const itemAmount =
    (Number(data.invoiceItemRate) || 0) *
    (Number(data.invoiceItemQuantity) || 0);

  // Prepare table row (for multiple items, loop through an array)
  const rows = [
    [
      data.invoiceItemDescription || "",
      data.invoiceItemQuantity || "",
      `${data.currency || "₹"} ${data.invoiceItemRate || 0} `,
      `${data.currency || "₹"} ${itemAmount || 0} `,
    ],
  ];

  autoTable(pdf, {
    startY: yPos,
    head: [["Description", "Quantity", "Rate", "Amount"]],
    body: rows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 11,
      halign: "left",
      valign: "middle",
    },
    headStyles: {
      fillColor: [200, 200, 200],
      textColor: [0, 0, 0],
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      halign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
    },
  });

  // Get current position after the table
  let finalY = pdf.lastAutoTable.finalY + 8;

  // 7. TOTAL SECTION
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total:", 140, finalY);
  pdf.text(`${data.total} ${data.currency}`, 170, finalY);
  finalY += 10;

  // 8. NOTE SECTION (if any)
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text("Note:", leftMargin, finalY);
    finalY += 6;
    const noteLines = pdf.splitTextToSize(data.note, 180);
    pdf.text(noteLines, leftMargin, finalY);
    finalY += noteLines.length * 6 + 5;
  }

  // 9. FOOTER
  pdf.line(leftMargin, 280, 195, 280);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.text("Thank you for your business!", leftMargin, 285);

  // 10. Return PDF buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
