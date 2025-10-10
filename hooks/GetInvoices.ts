import { db } from "@/utils/db"

const GetInvoices = async (userId:string)=>{
    const data = await db.invoice.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return data;
}

export default GetInvoices;