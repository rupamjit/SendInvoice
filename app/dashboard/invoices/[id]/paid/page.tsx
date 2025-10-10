import SubmitButton from '@/components/SubmitButton'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FindUser from '@/hooks/FindUser'
import markAsPaid from '@/lib/actions/markAsPaid'
import { db } from '@/utils/db'
import { Link } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'


const checkInovice = async (id:string,userId:string) => {
    const data = await db.invoice.findFirst({
        where:{
            id:id,
            userId
        }
    })
    if(!data){
        redirect("/dashboard/invoices")
    }
}

type InvoiceIdParams = Promise<{ id: string }>
const page = async ({ params }: { params: InvoiceIdParams }) => {
    const session = await FindUser()
      const { id } = await params;

      checkInovice(id,session.user?.id as string)

  return (
     <div className="flex flex-1 items-center justify-center">
            <Card className="max-w-[500px]">
                <CardHeader>
                    <CardTitle className="text-2xl">Mark As Paid</CardTitle>
                    <CardDescription>Are you sure you want to mark this invoice as paid?</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <Image src={PaidGIF} alt="paid-gif" className="rounded-lg" /> */}
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-4">
                    <Link href={`/dashboard/invoices`} className={buttonVariants({
                        variant: "outline",
                    })}>
                        Cancel
                    </Link>
                    <form action={async () => {
                        "use server"
                        await markAsPaid(id)
                    }} >
                        <SubmitButton text="Mark As Paid" />
                    </form>
                </CardFooter>
            </Card>
        </div>
  )
}

export default page