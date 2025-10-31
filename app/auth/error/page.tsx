// app/auth/error/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The sign in link is no longer valid. It may have been used already or expired.",
    Default: "An error occurred during authentication.",
  };

  const error = searchParams.error || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <div className="h-screen flex items-center justify-center px-4">
        <Card className="md:w-[40%] lg:w-[25%] w-[80%]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </div>
            <CardDescription>
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/login">
                  Try Again
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Error code: {error}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}