import SubmitButton from "@/components/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FindUser from "@/hooks/FindUser";
import deleteInvoice from "@/lib/actions/deleteInvoice";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type InvoiceIdParams = Promise<{ id: string }>;

const page = async ({ params }: { params: InvoiceIdParams }) => {
  const session = await FindUser();
  const userId = session.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const { id } = await params;

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex items-center justify-end gap-4">
          <Link
            href={`/dashboard/invoices`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteInvoice(id, userId);
            }}
          >
            <SubmitButton text="Delete Invoice" variant={"destructive"} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
