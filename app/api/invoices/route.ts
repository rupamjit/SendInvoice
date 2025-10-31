// import { NextResponse, NextRequest } from "next/server";
// import FindUser from "@/hooks/FindUser";
// import { invoiceCreationSchema } from "@/types/createInvoice";
// import { db } from "@/utils/db";
// import emailClient from "@/utils/emailClient";

// const formatCurrency = ({
//   amount,
//   currency,
// }: {
//   amount: number;
//   currency: string;
// }) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: currency,
//   }).format(amount);
// };

// export async function POST(request: NextRequest) {
//   try {
//     const session = await FindUser();
//     if (!session?.user?.id || !session.user.email) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();

//     const validation = invoiceCreationSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         {
//           message: "Invalid data provided",
//           errors: validation.error.flatten(),
//         },
//         { status: 400 }
//       );
//     }
//     const { data: validatedData } = validation;
//     const newInvoice = await db.invoice.create({
//       data: {
//         userId: session.user.id,
//         ...validatedData,
//       },
//     });

//     const sender = {
//       email: "hello@demomailtrap.co",
//       name: "Invoice Test",
//     };

//     const dueDate = new Date(validatedData.date);
//     dueDate.setDate(dueDate.getDate() + validatedData.dueDate);

//     const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/api/invoice/${
//       newInvoice.id
//     }`;
//     const formattedDueDate = new Intl.DateTimeFormat("en-US", {
//       dateStyle: "long",
//     }).format(dueDate);
//     const totalAmount = formatCurrency({
//       amount: validatedData.total,
//       currency: validatedData.currency,
//     });
//     // send the email
//     await emailClient.send({
//       from: sender,
//       to: [{ email: "rupamjitghosh@gmail.com" }],
//       subject: `Invoice #${validatedData.invoiceNumber} from ${sender.name}`,
//       text: `Hello ${validatedData.clientName},\n\nYou have a new invoice for ${totalAmount}.\nDue Date: ${formattedDueDate}\n\nYou can view the invoice here: ${invoiceLink}`,
//       html: `
//         <h1>New Invoice Received</h1>
//         <p>Hello ${validatedData.clientName},</p>
//         <p>This is a notification that you have received invoice #${validatedData.invoiceNumber} for <strong>${totalAmount}</strong>.</p>
//         <p><strong>Due Date:</strong> ${formattedDueDate}</p>
//         <p>You can view your invoice by clicking the link below:</p>
//         <a href="${invoiceLink}">View Invoice</a>
//         <br/>
//         <p>Thank you!</p>
//       `,
//       category: "Invoice Notification",
//     });

//     return NextResponse.json(newInvoice, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create invoice:", error);
//     return NextResponse.json(
//       { message: "An internal server error occurred." },
//       { status: 500 }
//     );
//   }
// }


// export async function PATCH(request:Request){
//     try {
//     const session = await FindUser();
//     if (!session?.user?.id || !session.user.email) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();

//     const validation = invoiceCreationSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         {
//           message: "Invalid data provided",
//           errors: validation.error.flatten(),
//         },
//         { status: 400 }
//       );
//     }
//     const { data: validatedData } = validation;
//     const newInvoice = await db.invoice.update({
//       where:{
//         id: body.id
//       },
//       data: {
//         userId: session.user.id,
//         ...validatedData,
//       },
//     });

//     const sender = {
//       email: "hello@demomailtrap.co",
//       name: "Invoice Test",
//     };

//     const dueDate = new Date(validatedData.date);
//     dueDate.setDate(dueDate.getDate() + validatedData.dueDate);

//     const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL!}/api/invoice/${
//       newInvoice.id
//     }`;
//     const formattedDueDate = new Intl.DateTimeFormat("en-US", {
//       dateStyle: "long",
//     }).format(dueDate);
//     const totalAmount = formatCurrency({
//       amount: validatedData.total,
//       currency: validatedData.currency,
//     });
//     // send the email
//     await emailClient.send({
//       from: sender,
//       to: [{ email: "rupamjitghosh@gmail.com" }],
//       subject: `Invoice #${validatedData.invoiceNumber} from ${sender.name}`,
//       text: `Hello ${validatedData.clientName},\n\nYou have a new invoice for ${totalAmount}.\nDue Date: ${formattedDueDate}\n\nYou can view the invoice here: ${invoiceLink}`,
//       html: `
//         <h1>New Updated Invoice Received</h1>
//         <p>Hello ${validatedData.clientName},</p>
//         <p>This is a notification that you have received invoice #${validatedData.invoiceNumber} for <strong>${totalAmount}</strong>.</p>
//         <p><strong>Due Date:</strong> ${formattedDueDate}</p>
//         <p>You can view and pay your invoice by clicking the link below:</p>
//         <a href="${invoiceLink}">View Invoice</a>
//         <br/>
//         <p>Thank you!</p>
//       `,
//       category: "Invoice Notification",
//     });

//     return NextResponse.json(newInvoice, { status: 201 });
//   } catch (error) {
//     console.error("Failed to create invoice:", error);
//     return NextResponse.json(
//       { message: "An internal server error occurred." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse, NextRequest } from "next/server";
import FindUser from "@/hooks/FindUser";
import { invoiceCreationSchema } from "@/types/createInvoice";
import { db } from "@/utils/db";
import resend from "@/utils/emailClient";

const formatCurrency = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export async function POST(request: NextRequest) {
  try {
    const session = await FindUser();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const validation = invoiceCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid data provided",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { data: validatedData } = validation;
    const newInvoice = await db.invoice.create({
      data: {
        userId: session.user.id,
        ...validatedData,
      },
    });

    const dueDate = new Date(validatedData.date);
    dueDate.setDate(dueDate.getDate() + validatedData.dueDate);

    const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/${newInvoice.id}`;
    
    const formattedDueDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(dueDate);
    
    const totalAmount = formatCurrency({
      amount: validatedData.total,
      currency: validatedData.currency,
    });

    // ✅ Send with Resend
    await resend.emails.send({
      from: 'Invoice Platform <onboarding@resend.dev>',
      to: [validatedData.clientEmail],
      subject: `New Invoice #${validatedData.invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Invoice Received</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Hello ${validatedData.clientName},</h2>
            <p>You have received invoice <strong>#${validatedData.invoiceNumber}</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount:</strong> ${totalAmount}</p>
              <p><strong>Due Date:</strong> ${formattedDueDate}</p>
            </div>

            <div style="text-align: center;">
              <a href="${invoiceLink}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                View Invoice
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Thank you!
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await FindUser();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const validation = invoiceCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid data provided",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { data: validatedData } = validation;
    const updatedInvoice = await db.invoice.update({
      where: {
        id: body.id,
      },
      data: {
        userId: session.user.id,
        ...validatedData,
      },
    });

    const dueDate = new Date(validatedData.date);
    dueDate.setDate(dueDate.getDate() + validatedData.dueDate);

    const invoiceLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices/${updatedInvoice.id}`;
    
    const formattedDueDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(dueDate);
    
    const totalAmount = formatCurrency({
      amount: validatedData.total,
      currency: validatedData.currency,
    });

    // ✅ Send with Resend
    await resend.emails.send({
      from: 'Invoice Platform <onboarding@resend.dev>',
      to: [validatedData.clientEmail],
      subject: `Updated Invoice #${validatedData.invoiceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Invoice Updated</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Hello ${validatedData.clientName},</h2>
            <p>Invoice <strong>#${validatedData.invoiceNumber}</strong> has been updated.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount:</strong> ${totalAmount}</p>
              <p><strong>Due Date:</strong> ${formattedDueDate}</p>
            </div>

            <div style="text-align: center;">
              <a href="${invoiceLink}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                View Updated Invoice
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

