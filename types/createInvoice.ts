

import z from "zod";

export const invoiceCreationSchema = z.object({
  invoiceName: z.string().min(1, "Invoice Name is required"),
  total: z.number().min(0), // Can be 0 initially
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
date: z.coerce.date().optional().default(new Date()),
  dueDate: z.coerce.number().min(0, "Due Date is required"),
  fromName: z.string().min(1, "Your name is required"),
  fromEmail: z.string().email("Invalid Email address"),
  fromAddress: z.string().min(1, "Your address is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid Email address"),
  clientAddress: z.string().min(1, "Client address is required"),
  currency: z.string().min(1, "Currency is required"),
  invoiceNumber: z.coerce.number().min(1, "Minimum invoice number is 1"),
  note: z.string().optional(),
  invoiceItemDescription: z.string().min(1, "Description is required"),
  invoiceItemQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  invoiceItemRate: z.coerce.number().min(1, "Rate must be at least 1"),
});