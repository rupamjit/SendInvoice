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

    // ✅ Fix: Format the invoice link correctly
    const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/${invoiceData.id}`;

    // ✅ Fix: Format date properly
    const formattedDate = new Date(invoiceData.dueDate).toLocaleDateString("en-IN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // ✅ Fix: Format currency properly
    const formattedTotal = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: invoiceData.currency || 'INR'
    }).format(invoiceData.total);

    // ✅ Send with Resend
    const { data, error } = await resend.emails.send({
      from: 'Invoice Platform <onboarding@resend.dev>',
      to: [invoiceData.clientEmail], // ✅ Fix: Use actual client email
      subject: `Invoice #${invoiceData.invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Invoice Received</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333; margin-top: 0;">Hello ${invoiceData.clientName},</h2>
                      
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        You have received invoice <strong>#${invoiceData.invoiceNumber}</strong> from <strong>${invoiceData.fromName}</strong>.
                      </p>
                      
                      <!-- Invoice Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 10px 0; color: #333333; font-size: 16px;">
                              <strong>Invoice Number:</strong> #${invoiceData.invoiceNumber}
                            </p>
                            <p style="margin: 10px 0; color: #333333; font-size: 16px;">
                              <strong>Amount:</strong> <span style="color: #667eea; font-size: 20px; font-weight: bold;">${formattedTotal}</span>
                            </p>
                            <p style="margin: 10px 0; color: #333333; font-size: 16px;">
                              <strong>Due Date:</strong> ${formattedDate}
                            </p>
                            ${invoiceData.note ? `
                            <p style="margin: 10px 0; color: #666666; font-size: 14px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                              <strong>Note:</strong> ${invoiceData.note}
                            </p>
                            ` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${invoiceLink}" 
                               style="display: inline-block;
                                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                      color: #ffffff;
                                      text-decoration: none;
                                      padding: 16px 40px;
                                      border-radius: 8px;
                                      font-weight: bold;
                                      font-size: 16px;">
                              View Invoice
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Description -->
                      ${invoiceData.invoiceItemDescription ? `
                      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          <strong>Description:</strong><br/>
                          ${invoiceData.invoiceItemDescription}
                        </p>
                      </div>
                      ` : ''}
                      
                      <!-- Footer Info -->
                      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                      
                      <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                        <strong>From:</strong><br/>
                        ${invoiceData.fromName}<br/>
                        ${invoiceData.fromEmail}<br/>
                        ${invoiceData.fromAddress}
                      </p>
                      
                      <p style="color: #999999; font-size: 12px; margin-top: 20px;">
                        If you have any questions about this invoice, please contact ${invoiceData.fromEmail}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        This is an automated email from Invoice Platform
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
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

    console.log("Email sent successfully:", data);

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
