// @ts-nocheck
"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useForm, useWatch } from "react-hook-form";
import { Badge } from "./ui/badge";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceCreationSchema } from "@/types/createInvoice";
import { useRouter } from "next/navigation";
import z from "zod";
import { Invoice } from "@prisma/client";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

export const currencies = [
  { value: "USD", label: "United States Dollar -- USD" },
  { value: "EUR", label: "Euro -- EUR" },
  { value: "GBP", label: "Pound Sterling -- GBP" },
  { value: "INR", label: "Indian Rupee -- INR" },
  { value: "JPY", label: "Japanese Yen -- JPY" },
];

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

const EditInvoice = ({ invoice }: { invoice: Invoice }) => {
  type InvoiceFormValues = z.infer<typeof invoiceCreationSchema>;
  const router = useRouter();
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceCreationSchema),
    defaultValues: {
      invoiceName: invoice.invoiceName,
      invoiceNumber: invoice.invoiceNumber,
      fromName: invoice.fromName,
      fromEmail: invoice.fromEmail,
      fromAddress: invoice.fromAddress,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: invoice.clientAddress,
      invoiceItemDescription: invoice.invoiceItemDescription,
      invoiceItemQuantity: invoice.invoiceItemQuantity || 1,
      invoiceItemRate: invoice.invoiceItemRate || 0,
      note: invoice.note,
      currency: invoice.currency || "USD",
      date: new Date(invoice.date),
      dueDate: invoice.dueDate || 0,
      total: invoice.total || 0,
    },
  });

  const [quantity, rate, currency] = useWatch({
    control: form.control,
    name: ["invoiceItemQuantity", "invoiceItemRate", "currency"],
  });

  const subtotal = (quantity || 0) * (rate || 0);

  useEffect(() => {
    form.setValue("total", subtotal);
  }, [subtotal, form]);

    async function onSubmit(values: InvoiceFormValues) {
        const data = {
            ...values,
            id:invoice.id
        }
        console.log(data);
        const response = await axios.patch("/api/invoices",data)
        // console.log(response)
        if(response.status == 201){
          toast("invoice updated sucesfully",{cancel:true,position:"top-center"})
        router.push("/dashboard/invoices")
        }else{
          toast("Internal Server Error",{cancel:true})
        }
    }

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                {/* Invoice Name */}

                <div className="flex flex-col gap-1 w-fit mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="default">Draft</Badge>
                    <FormField
                      control={form.control}
                      name="invoiceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Test 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Invoice Number and Currency */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Invoice No.</Label>
                        <FormControl>
                          <div className="flex">
                            <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                              #
                            </span>
                            <Input
                              className="rounded-l-none"
                              placeholder="101"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Currency</Label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* From and To sections */}
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  {/* FIX: Added the 'From' FormFields */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-base">From</Label>
                    <FormField
                      control={form.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fromAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="font-semibold text-base">To</Label>
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Client's Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Client's Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Client's Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date and Due Date */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Due Date</Label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Due Date" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Due on Receipt</SelectItem>
                            <SelectItem value="15">Net 15</SelectItem>
                            <SelectItem value="30">Net 30</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm text-muted-foreground">
                    <p className="col-span-6">Description</p>
                    <p className="col-span-2">Quantity</p>
                    <p className="col-span-2">Rate</p>
                    <p className="col-span-2 text-right">Amount</p>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4 items-start">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="invoiceItemDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Description of service or product..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="invoiceItemQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="invoiceItemRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="100.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end h-10">
                      <span className="font-medium text-sm">
                        {formatCurrency(subtotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mt-4">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(subtotal, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="mt-8">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Note</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Add a note to this invoice..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end mt-6">
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Updating..."
                      : "Update Invoice"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditInvoice;
