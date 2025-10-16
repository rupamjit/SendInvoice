import { db } from "@/utils/db"
import { redirect } from "next/navigation";

const deleteInvoice = async(id:string,userId:string) => {
    await db.invoice.delete({
        where:{
            id:id,
            userId:userId
        }
    })

    return redirect("/dashboard/invoices");
}

export default deleteInvoice