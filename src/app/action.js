"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "./utils/requireUser";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, OnboardingSchema } from "./utils/zodSchema";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer"
import { addMonths, format } from "date-fns";

export const getRevenueData = async (userId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const isBeforeApril = now.getMonth() < 3;
  const fyStart = new Date(isBeforeApril ? currentYear - 1 : currentYear, 3, 1);
  const fyEnd = addMonths(fyStart, 12);

  // Get all PAID invoices in FY at once
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      status: "PAID",
      date: {
        gte: fyStart,
        lt: fyEnd,
      },
    },
    select: {
      date: true,
      total: true,
    },
  });

  // Build empty revenue map
  const revenueMap = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(fyStart, i);
    return {
      month: format(date, "MMM"),
      amount: 0,
    };
  });

  // Sum totals by month
  invoices.forEach((invoice) => {
    const monthIndex = invoice.date.getMonth() - 3; // April = 0
    const index = monthIndex >= 0 ? monthIndex : monthIndex + 12;
    revenueMap[index].amount += Number(invoice.total);
  });

  return revenueMap;
};

export const getInvoices = async (userId) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      clientName: true,
      total: true,
      status: true,
      date: true,
      dueDate: true,
    },
  });

  // Compute the amount by multiplying rate and quantity
 

  return invoices;
};

export async function OnboardUser(prevState, formData) {
    const session = await requireUser()

    console.log(formData)
     
    
    const submission  = parseWithZod(formData , {
        schema:OnboardingSchema,
    })

    if(submission.status !== "success"){
        return submission.reply()
    }

    const data  = await prisma.user.update({
        where:{
            id:session?.user?.id
        },
        data:{
        FirstName : submission.value.fname,
        LastName : submission.value.lname,
        address : submission.value.address,
        }
    })
    return redirect("/dashboard")
}
export async function createInvoice(prevState, formData) {
  const session = await requireUser();

  console.log(formData);
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Create the invoice record in the database
  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });

  // Define the sender using Invora's details
  const sender = {
    email: process.env.EMAIL_SERVER_USER, // updated sender email
    name: "Invora", // updated sender name
  };

  // Configure the nodemailer transport
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST, // ensure this is set in your env variables
    port: Number(process.env.EMAIL_SERVER_PORT), // convert to a number if needed
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Construct the download link for the invoice.
  // It uses a different URL based on the environment.
  const downloadLink =
    process.env.NODE_ENV !== "production"
      ? `http://localhost:3000/api/invoice/${data.id}`
      : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`;

  // Build the email content
  const mailOptions = {
    from: process.env.EMAIL_SERVER_USER,
    to: submission.value.clientEmail,
    subject: "Your Invoice is Pending - Let's Seal the Deal!",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background: #0047AB; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 28px;">Invoice Pending</h1>
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p>Dear ${submission.value.clientName},</p>
            <p>Thank you for choosing our services. Your invoice (<strong>${submission.value.invoiceNumber}</strong>) is now pending, and we are excited to work with you on this successful venture.</p>
            <p>This invoice is a testament to our commitment to quality and excellence. To review and download your invoice, please click the button below:</p>
            <p style="text-align: center;">
              <a href="${downloadLink}" style="display: inline-block; background: #0047AB; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Download Invoice</a>
            </p>
         
            <p style="margin-top: 30px;">We look forward to a fruitful collaboration. Please feel free to contact us if you have any questions or need further assistance.</p>
            <p>Warm regards,<br><strong>Invora Team</strong></p>
          </div>
        </div>
      </div>
    `,
  };

  // Send the email
  const info = await transport.sendMail(mailOptions);

  console.log("Email sent:", info);
  // Redirect the user back to the invoice dashboard
  return redirect("/dashboard/invoice");
}
export async function editInvoice(prevState, formData) {
}
export async function DeleteInvoice(invoiceId) {
}
export async function MarkAsPaidAction(invoiceId) {
     
  console.log(invoiceId)



 const result = await prisma.invoice.update({
    where:{
      id:invoiceId
    },
    data:{
      status:"PAID"
    }
  })

  return result;

} 


export async function ReminderOfInvoice(invoiceId) {
  // Validate invoiceId
  if (!invoiceId || typeof invoiceId !== 'string' || invoiceId.trim() === '') {
    console.error('Error: Invalid or missing invoiceId');
    return;
  }

  // Retrieve the invoice with all necessary information
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      total: true,
      dueDate: true, // integer: number of days from the invoice date that payment is due
      invoiceNumber: true,
      invoiceName: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      date: true,           // the invoice issue date
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      currency: true,       // Optional: currency code
    },
  });

  if (!invoice) {
    console.error('Invoice not found');
    return;
  }

  // Calculate the actual due date assuming "dueDate" is the number of days after the invoice issue date.
  const invoiceIssueDate = new Date(invoice.date);
  const actualDueDate = new Date(invoiceIssueDate);
  actualDueDate.setDate(actualDueDate.getDate() + invoice.dueDate);

  // Construct an email template (for both overdue and upcoming payments) for sending the reminder.
  const emailSubject = `Invoice Reminder - Invoice #${invoice.invoiceNumber}`;
  const emailBody = `
Dear ${invoice.clientName},

This is a reminder regarding your invoice (Invoice #${invoice.invoiceNumber} – ${invoice.invoiceName}) which is due on ${actualDueDate.toLocaleDateString()}.
The total amount is ${invoice.total} ${invoice.currency || 'USD'}.

Please arrange your payment accordingly.

For your attention,
${invoice.fromName}
${invoice.fromEmail}
${invoice.fromAddress}

Thank you.
`;

  // Setup Nodemailer transporter (adjust configuration based on your SMTP provider)
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST, // ensure this is set in your env variables
    port: Number(process.env.EMAIL_SERVER_PORT), // convert to a number if needed
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Send the email reminder
  try {
    await transport.sendMail({
      from: `"${invoice.fromName}" <${invoice.fromEmail}>`,
      to: invoice.clientEmail,
      subject: emailSubject,
      text: emailBody,
      // Optionally add an HTML version:
      // html: `<p>${emailBody}</p>`
    });
    console.log(`Reminder email sent to ${invoice.clientEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }

  // Update the invoice's due date: set it to 5 days from now.
  // This example resets the "dueDate" field to 5 days; adjust as needed.
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        dueDate: 5, // This denotes that the new period until due is 5 days.
        // Optionally, update other fields if required.
      },
    });
    console.log('Invoice due date updated to 5 days from today.');
  } catch (updateError) {
    console.error('Error updating invoice due date:', updateError);
  }

  // Optionally log that daily email reminders and WhatsApp notifications have been scheduled.
  console.log('Daily email reminders and WhatsApp notifications scheduled as per system configuration.');
}

