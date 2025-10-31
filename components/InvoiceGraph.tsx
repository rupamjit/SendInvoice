
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Graph from "./Graph";
import { db } from "@/utils/db";
import FindUser from "@/hooks/FindUser";

async function getInvoices(userId: string) {
  const rawData = await db.invoice.findMany({
    where: {
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      total: true,
      date: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Aggregate by date AND status
  const aggregatedData = rawData.reduce(
    (acc: { [key: string]: { paid: number; pending: number; draft: number } }, curr) => {
      const date = new Date(curr.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { paid: 0, pending: 0, draft: 0 };
      }

      // Aggregate by status
      if (curr.status === "PAID") {
        acc[date].paid += curr.total;
      } else if (curr.status === "PENDING") {
        acc[date].pending += curr.total;
      } else if (curr.status === "DRAFT") {
        acc[date].draft += curr.total;
      }

      return acc;
    },
    {}
  );

  // Transform to array format for chart
  const transformedData = Object.entries(aggregatedData)
    .map(([date, amounts]) => ({
      date,
      paid: amounts.paid,
      pending: amounts.pending,
      draft: amounts.draft,
      originalDate: new Date(date + ", " + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, paid, pending, draft }) => ({
      date,
      paid,
      pending,
      draft,
    }));

  return transformedData;
}

const InvoiceGraph = async () => {
  const session = await FindUser();
  const data = await getInvoices(session.user?.id as string);
  console.log("Data from InvoiceGraph",data)
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices which have been paid in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
};

export default InvoiceGraph;
