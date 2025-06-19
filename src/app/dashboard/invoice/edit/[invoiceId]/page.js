import { EditInvoice } from '../components/edit-form'
import { requireUser } from '@/utils/requireUser'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

async function getInvoiceData(invoiceId) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  })

  if (!invoice) {
    return notFound()
  }

  return invoice
}

async function getUserData(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      FirstName: true,
      LastName: true,
      address: true,
      email: true,
    },
  })

  return user
}

export default async function EditInvoicePage({ params }) {
  const session = await requireUser()
  const { invoiceId } = await params

  const [invoice, user] = await Promise.all([
    getInvoiceData(invoiceId),
    getUserData(session.user?.id),
  ])

  return (
    <EditInvoice
      invoice={invoice}
      address={user?.address || ''}
      email={user?.email || ''}
      firstName={user?.firstName || ''}
      lastName={user?.lastName || ''}
    />
  )
}
