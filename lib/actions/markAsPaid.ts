import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";

const markAsPaid = async (id: string) => {
  const session = await FindUser();
  const data = await db.invoice.update({
    where: {
      userId: session.user?.id,
      id: id,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
};

export default markAsPaid;
