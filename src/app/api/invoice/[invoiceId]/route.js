import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

export async function GET(request, { params }) {

  const {invoiceId } = await params
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
  });

  if (!data) {
    return new NextResponse(JSON.stringify({ error: "Invoice not found" }), { status: 404 });
  }

  // Helper to format a date in a clear long style.
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create a new PDF document (A4, portrait).
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Define common layout values.
  const leftMargin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;

  // -----------------------------
  // Header Section: Title & Metadata
  // -----------------------------
  // Centered Invoice Title.
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.text("INVOICE", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Invoice metadata: Invoice Number (left) and Issue Date (right).
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Invoice Number: ${data.invoiceNumber}`, leftMargin, yPosition);
  pdf.text(`Issue Date: ${formatDate(data.date)}`, pageWidth - leftMargin, yPosition, { align: "right" });
  yPosition += 10;

  // Divider line for a clean look.
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
  yPosition += 5;

  // -----------------------------
  // Payment Details Section: From & To
  // -----------------------------
  const totalWidth = pageWidth - leftMargin * 2;
  const columnWidth = totalWidth / 2;
  let sectionY = yPosition;

  // "PAY TO:" Section (sender details).
  pdf.setFont("helvetica", "bold");
  pdf.text("PAY TO:", leftMargin, sectionY);
  sectionY += 5;
  pdf.setFont("helvetica", "normal");
  pdf.text(data.fromName || "", leftMargin, sectionY);
  sectionY += 5;
  if (data.fromAddress) {
    const addressLines = pdf.splitTextToSize(data.fromAddress, columnWidth);
    pdf.text(addressLines, leftMargin, sectionY);
    sectionY += addressLines.length * 4;
  }
  if (data.fromEmail) {
    pdf.text(`Email: ${data.fromEmail}`, leftMargin, sectionY);
    sectionY += 4;
  }

  // "BILLED TO:" Section (client details) on the right column.
  let clientY = yPosition;
  const rightColumnX = leftMargin + columnWidth;
  pdf.setFont("helvetica", "bold");
  pdf.text("BILLED TO:", rightColumnX, clientY);
  clientY += 5;
  pdf.setFont("helvetica", "normal");
  pdf.text(data.clientName || "", rightColumnX, clientY);
  clientY += 5;
  if (data.clientAddress) {
    const clientAddressLines = pdf.splitTextToSize(data.clientAddress, columnWidth);
    pdf.text(clientAddressLines, rightColumnX, clientY);
    clientY += clientAddressLines.length * 4;
  }
  if (data.clientEmail) {
    pdf.text(`Email: ${data.clientEmail}`, rightColumnX, clientY);
    clientY += 4;
  }

  // Set yPosition to the taller of the two columns, plus some spacing.
  yPosition = Math.max(sectionY, clientY) + 20;

  // -----------------------------
  // Invoice Items Table Section
  // -----------------------------
  // Divider before the table.
  pdf.line(leftMargin, yPosition, pageWidth - leftMargin, yPosition);
  yPosition += 5;

  
  // Build table rows using only the provided variables.
  const tableRows = [
    [
      data.invoiceItemDescription || "",
      `₹${Number(data.invoiceItemRate)}`,
      data.invoiceItemQuantity?.toString() || "",
      `₹${(Number(data.invoiceItemRate) * Number(data.invoiceItemQuantity))}`
    ]
  ];
  

  // Generate the table using autoTable.
  autoTable(pdf, {
    startY: yPosition,
    head: [["DESCRIPTION", "RATE", "QUANTITY", "AMOUNT"]],
    body: tableRows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.2,
      halign: "left",
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: "bold",
      halign: "left"
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 35, halign: "center" }
    }
  });
  
  let finalY = pdf.lastAutoTable.finalY + 10;

  // -----------------------------
  // Total Amount Section
  // -----------------------------
  pdf.setFont("helvetica", "bold");
  pdf.text("TOTAL:", pageWidth - leftMargin - 50, finalY);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    formatCurrency(Number(data.total), data.currency || "INR"),
    pageWidth - leftMargin,
    finalY,
    { align: "right" }
  );
  finalY += 10;

  // -----------------------------
  // Notes Section
  // -----------------------------
  if (data.note) {
    pdf.setFont("helvetica", "bold");
    pdf.text("Notes:", leftMargin, finalY);
    finalY += 5;
    pdf.setFont("helvetica", "normal");
    const noteLines = pdf.splitTextToSize(data.note, pageWidth - leftMargin * 2);
    pdf.text(noteLines, leftMargin, finalY);
    finalY += noteLines.length * 4;
  }

  // -----------------------------
  // Footer Section: Divider & Page Numbers
  // -----------------------------
  pdf.setLineWidth(0.5);
  pdf.line(leftMargin, 280, pageWidth - leftMargin, 280);
  pdf.setFontSize(9);
  pdf.text("Thank you for your business!", leftMargin, 286);

  // Add page numbers if the document spans multiple pages.
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - leftMargin, 290, { align: "right" });
  }

  // Convert the PDF to a buffer and return it with appropriate headers.
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Invoice-${data.invoiceNumber}.pdf"`,
    },
  });
}
