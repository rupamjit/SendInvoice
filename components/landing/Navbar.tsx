
import { Button } from "@/components/ui/button";
import { auth } from "@/utils/auth";
import { Send } from "lucide-react";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex flex-wrap items-center justify-between px-4 py-5 lg:px-8">
      <Link href="/" className="flex items-center gap-2">
        <div className="h-14 flex border-b items-center px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Send className="size-7" />
            <p className="text-2xl font-bold">
              Send<span className="text-blue-600">Invoice</span>
            </p>
          </Link>
        </div>
      </Link>
      <Link href={session?.user ? "/dashboard" : "/login"}>
        <Button
          className="bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 lg:mt-0"
          size="lg"
        >
          {session?.user ? "Dashboard" : "Get Started"}
        </Button>
      </Link>
    </nav>
  );
}
