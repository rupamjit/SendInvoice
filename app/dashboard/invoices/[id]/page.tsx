import EditInvoice from "@/components/EditInvoice";
import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import { notFound    } from "next/navigation";
import React from "react";

type InvoiceIdParams = Promise<{ id: string }>;

const page = async ({ params }: { params: InvoiceIdParams }) => {
  const { id } = await params;
  const session = await FindUser();

  const invoice = await db.invoice.findUnique({
    where: {
      id: id,
      userId: session.user?.id,
    },
  });

  if (!invoice) {
    return notFound();
  }

  return (
    <div>
      <EditInvoice invoice={invoice} />
    </div>
  );
};

export default page;
