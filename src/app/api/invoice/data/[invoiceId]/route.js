import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { invoiceId } = params;
  
  try {
    // Retrieve the invoice data
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
        status: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    return NextResponse.json({ error: "Failed to fetch invoice data" }, { status: 500 });
  }
}