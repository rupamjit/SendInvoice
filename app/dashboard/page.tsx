import DashboardBlocks from "@/components/DashBoardBlock";
import EmptyInvoice from "@/components/EmptyInvoice";
import InvoiceGraph from "@/components/InvoiceGraph";
import RecentInvoices from "@/components/RecentInvoices";
import { Skeleton } from "@/components/ui/skeleton";
import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import React, { Suspense } from "react";

async function getData(userId: string) {
  const data = await db.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  return data;
}

const page = async () => {
  const session = await FindUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyInvoice
          title="No invoices found"
          description="Create an invoice to see it right here"
          buttontext="Create Invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
          <DashboardBlocks />
          <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
            <InvoiceGraph />
            <RecentInvoices />
          </div>
        </Suspense>
      )}
    </>
  );
};

export default page;
