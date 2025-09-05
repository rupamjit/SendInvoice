import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  CheckCircle,
  Download,
  Edit,
  Mail,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const InvoiceAction = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-300 rounded-full"
        >
          <MoreHorizontal className="h-5 w-5 text-primary" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1 rounded-xl shadow-lg animate-in zoom-in-95 duration-100"
      >
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/invoices/123`}
            className="flex items-center px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
          >
            <Edit className="mr-3 h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-200" />
            <span className="font-medium">Edit Invoice</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/api/invoice/123`}
            target="_blank"
            className="flex items-center px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
          >
            <Download className="mr-3 h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-200" />
            <span className="font-medium">Download PDF</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors duration-200 group cursor-pointer">
          <Mail className="mr-3 h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-200" />
          <span className="font-medium">Send Reminder Email</span>
        </DropdownMenuItem>
        {/* {status !== "PAID" && ( */}
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/invoices/123/paid`}
            className="flex items-center px-3 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors duration-200 group"
          >
            <CheckCircle className="mr-3 h-5 w-5 text-primary group-hover:text-primary/80 transition-colors duration-200" />
            <span className="font-medium">Mark as Paid</span>
          </Link>
        </DropdownMenuItem>
        {/* )} */}
        <DropdownMenuSeparator className="my-1 opacity-50" />
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/invoices/1234/delete`}
            className="flex items-center px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200 group"
          >
            <Trash2 className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
            <span className="font-medium text-red-500 group-hover:text-red-600">
              Delete Invoice
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceAction;
