// @ts-ignore
import jsPDF from "jspdf";

interface iInvoiceData {
  invoiceName: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string | number;
  date: Date;
  dueDate: string | number;
  invoiceItemDescription: string;
  invoiceItemQuantity: number;
  invoiceItemRate: number;
  total: number;
  currency: string;
  note?: string | null;
}

interface iAppProps {
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "INR" | "JPY" | "NPR" | "CAD" | "AUD";
}

function formatCurrency({ amount, currency }: iAppProps) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);

export const generateInvoicePDF = (data: iInvoiceData): jsPDF => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // --- Header ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(data.invoiceName, 20, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");

  // --- From Section ---
  pdf.setFont("helvetica", "bold");
  pdf.text("From:", 20, 35);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.fromName, 20, 40);
  pdf.text(data.fromEmail, 20, 45);
  pdf.text(data.fromAddress, 20, 50);

  // --- Client Section ---
  pdf.setFont("helvetica", "bold");
  pdf.text("Bill To:", 120, 35);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.clientName, 120, 40);
  pdf.text(data.clientEmail, 120, 45);
  pdf.text(data.clientAddress, 120, 50);

  // --- Invoice Info ---
  pdf.setFont("helvetica", "bold");
  pdf.text(`Invoice #:`, 20, 65);
  pdf.text(`Date:`, 20, 70);
  pdf.text(`Due:`, 20, 75);
  pdf.setFont("helvetica", "normal");
  pdf.text(String(data.invoiceNumber), 50, 65);
  pdf.text(formatDate(data.date), 50, 70);
  pdf.text(`Net ${data.dueDate} days`, 50, 75);

  // --- Table Headers ---
  const tableTop = 90;
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, tableTop);
  pdf.text("Qty", 120, tableTop, { align: "right" });
  pdf.text("Rate", 140, tableTop, { align: "right" });
  pdf.text("Total", 170, tableTop, { align: "right" });
  pdf.line(20, tableTop + 2, 190, tableTop + 2); // horizontal line

  // --- Table Item ---
  const itemTop = tableTop + 10;
  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoiceItemDescription, 20, itemTop);
  pdf.text(String(data.invoiceItemQuantity), 120, itemTop, { align: "right" });
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    140,
    itemTop,
    { align: "right" }
  );
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    170,
    itemTop,
    { align: "right" }
  );

  // --- Total ---
  pdf.line(120, itemTop + 5, 190, itemTop + 5);
  pdf.setFont("helvetica", "bold");
  pdf.text("Total:", 140, itemTop + 12, { align: "right" });
  pdf.text(
    formatCurrency({ amount: data.total, currency: data.currency as any }),
    170,
    itemTop + 12,
    { align: "right" }
  );

  // --- Notes ---
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, itemTop + 25);
    pdf.text(data.note, 20, itemTop + 30);
  }

  return pdf;
};
