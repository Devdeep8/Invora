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

    console.log(formData)
    const submission = parseWithZod(formData, {
      schema: invoiceSchema,
    });
  
    if (submission.status !== "success") {
      return submission.reply();
    }
  
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
  
    const sender = {
      email: "hello@demomailtrap.com",
      name: "Jan Marshal",
    };


    nodemailer.createTransport ({
      host:process.env.EMAIL_SERVER_USER,
      port:EMAIL_SERVER_PORT,
      auth:{
          user:EMAIL_SERVER_USER,
          pass:EMAIL_SERVER_PASSWORD
      }
  })


  


  
    // emailClient.send({
    //   from: sender,
    //   to: [{ email: "jan@alenix.de" }],
    //   template_uuid: "3c01e4ee-a9ed-4cb6-bbf7-e57c2ced6c94",
    //   template_variables: {
    //     clientName: submission.value.clientName,
    //     invoiceNumber: submission.value.invoiceNumber,
    //     invoiceDueDate: new Intl.DateTimeFormat("en-US", {
    //       dateStyle: "long",
    //     }).format(new Date(submission.value.date)),
    //     invoiceAmount: formatCurrency({
    //       amount: submission.value.total,
    //       currency: submission.value.currency ,
    //     }),
    //     invoiceLink:
    //       process.env.NODE_ENV !== "production"
    //         ? `http://localhost:3000/api/invoice/${data.id}`
    //         : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
    //   },
    // });
  
    return redirect("/dashboard/invoice");
  }
  

export async function editInvoice(prevState, formData) {
}

export async function DeleteInvoice(invoiceId) {
}

export async function MarkAsPaidAction(invoiceId) {
}