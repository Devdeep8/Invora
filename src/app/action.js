"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "./utils/requireUser";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, OnboardingSchema } from "./utils/zodSchema";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer"


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
}