import InvoiceList from "@/components/InvoiceList";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
            <CardDescription>
              Manage and view all your invoices in one place.
            </CardDescription>
          </div>

          <div>
            <Link
              href="/dashboard/invoices/create"
              className={buttonVariants({
                className: "w-full",
                variant: "outline",
              })}
            >
              <PlusIcon /> Create Invoice
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <Suspense fallback={<Skeleton className="w-full h-[500px]" />}> */}
                    <InvoiceList />
                {/* </Suspense> */}
      </CardContent>
    </Card>
  );
};

export default page;
