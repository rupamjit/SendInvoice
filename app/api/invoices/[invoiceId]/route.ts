// import { db } from "@/utils/db";
// import { generateInvoicePDF } from "@/utils/generatePdf";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   {
//     params,
//   }: {
//     params: Promise<{ invoiceId: string }>;
//   }
// ) {
//   try {
//     const { invoiceId } = await params;

//     // Fetch invoice data
//     const data = await db.invoice.findUnique({
//       where: { id: invoiceId },
//       select: {
//         invoiceName: true,
//         invoiceNumber: true,
//         currency: true,
//         fromName: true,
//         fromEmail: true,
//         fromAddress: true,
//         clientName: true,
//         clientAddress: true,
//         clientEmail: true,
//         date: true,
//         dueDate: true,
//         invoiceItemDescription: true,
//         invoiceItemQuantity: true,
//         invoiceItemRate: true,
//         total: true,
//         note: true,
//       },
//     });

//     // Handle missing invoice
//     if (!data) {
//       return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
//     }

//     // Generate PDF
//     const pdf = generateInvoicePDF(data);
//     const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

//     return new NextResponse(pdfBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `inline; filename="invoice-${data.invoiceNumber}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("Error generating invoice PDF:", error);
//     return NextResponse.json(
//       { error: "An error occurred while generating the invoice." },
//       { status: 500 }
//     );
//   }
// }




import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import resend from "@/utils/emailClient";
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

    const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/${invoiceData.id}`;

    const formattedDate = new Date(invoiceData.dueDate).toLocaleDateString("en-IN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoiceData.currency || 'INR'
    }).format(invoiceData.total);

    // ✅ Send with Resend
    const { data, error } = await resend.emails.send({
      from: 'Invoice Platform <onboarding@resend.dev>',
      to: [invoiceData.clientEmail],
      subject: `Invoice #${invoiceData.invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Invoice</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hello ${invoiceData.clientName},</h2>
            <p style="color: #666; font-size: 16px;">
              You have received invoice <strong>#${invoiceData.invoiceNumber}</strong> from ${invoiceData.fromName}.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="margin: 10px 0; font-size: 16px; color: #333;">
                <strong>Amount:</strong> <span style="color: #667eea;">${formattedTotal}</span>
              </p>
              <p style="margin: 10px 0; font-size: 16px; color: #333;">
                <strong>Due Date:</strong> ${formattedDate}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${invoiceLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 40px;
                        text-decoration: none;
                        border-radius: 8px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;">
                View Invoice
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Questions? Contact ${invoiceData.fromEmail}
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Failed to send email", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Invoice reminder sent successfully!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
