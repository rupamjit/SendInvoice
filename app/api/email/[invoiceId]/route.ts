import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import emailClient from "@/utils/emailClient";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const session = await FindUser();
    const { invoiceId } = await params;

    const invoiceData = await db.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.co",
      name: "Invoice Test",
    };

    const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/api/invoices/${
      invoiceData.id
    }`;

    const formattedDate = new Date(invoiceData.dueDate).toLocaleDateString(
      "en-IN"
    );

    await emailClient.send({
      from: sender,
      to: [{ email: "rupamjitghosh@gmail.com" }],
      subject: `Invoice #${invoiceData.invoiceNumber} from ${sender.name}`,
      text: `Hello ${invoiceData.clientName},\n\nYou have a new invoice for ${invoiceData.total}.\nDue Date: ${formattedDate}\n\nYou can view the invoice here: ${invoiceLink}`,
      html: `
        <h1>New Invoice Received</h1>
        <p>Hello ${invoiceData.clientName},</p>
        <p>This is a notification that you have received invoice #${invoiceData.invoiceNumber} for <strong>${invoiceData.total}</strong>.</p>
        <p><strong>Due Date:</strong> ${invoiceData}</p>
        <p>You can view your invoice by clicking the link below:</p>
        <a href="${invoiceLink}">View Invoice</a>
        <br/>
        <p>Thank you!</p>
      `,
      category: "Invoice Notification",
    });

    return NextResponse.json(
      { message: "Invoice reminder sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Sending Invoice", error);
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 }
    );
  }
}
