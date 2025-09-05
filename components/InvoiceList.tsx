import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import InvoiceAction from "./InvoiceAction";



const InvoiceList = () => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>123</TableCell>
          <TableCell>john doe</TableCell>
          <TableCell>23424$</TableCell>
          <TableCell>
            <Badge>pending</Badge>
          </TableCell>
          <TableCell>03/08/2025</TableCell>
          <TableCell className="text-right">
            <InvoiceAction />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default InvoiceList;
