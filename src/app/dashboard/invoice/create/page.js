import { CreateInvoice } from "./components/Create-Invoice";
import prisma from "@/lib/prisma";
import { requireUser } from "@/utils/requireUser";


async function getUserData(userId) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      FirstName: true,
      LastName: true,
      address: true,
      email: true,
    },
  });

  return data;
}

export default async function InvoiceCreationRoute() {
  const session = await requireUser();
  const data = await getUserData(session.user?.id );
  return (
    <CreateInvoice
      lastName={data?.LastName }
      address={data?.address }
      email={data?.email }
      firstName={data?.FirstName}
    />
  );
}